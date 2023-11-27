/* eslint-disable import/no-extraneous-dependencies, import/no-relative-packages */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import json5 from 'json5';
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyStatic from '@fastify/static';
import { init } from '../models/index.mjs';
import { getEmbeddings, normalizeEmbedding } from '../lib/Embeddings.mjs';
import { search, summarize, shorten, normalizeQuery, sanitizeQueryForIndexing } from '../lib/Search.mjs';

const isProduction = process.env.NODE_ENV === 'production';

const logger = isProduction ? undefined : {
  transport: {
    target: '@fastify/one-line-logger'
  }
};

const fastify = Fastify({
  logger
});

fastify.register(FastifyCors, {
  origin: '*'
});

const sequelize = await init();
fastify.decorate('sequelize', sequelize);

const configuration = json5.parse(fs.readFileSync('../configuration.json5'));

async function createSummary(id, query, summaryModelName, contextEntries) {
  const record = await sequelize.models.Search.findByPk(id);

  if (process.env.EMULATE_SUMMARY) {
    console.warn("WARNING: emulated summary");

    setTimeout(async () => {
      record.summary = 'Emulated summary for your enjoyment';
      await record.save();
    }, 2000);

    return;
  }

  record.summary = await summarize(query, summaryModelName, contextEntries);
  await record.save();
}

if (process.env.NODE_ENV === 'production') {
  fastify.register(FastifyStatic, {
    root: path.join(process.cwd(), '..', 'frontend-dist')
  });

} else {
  fastify.setErrorHandler((error, request, reply) => console.error(request.url, error)); // eslint-disable-line no-unused-vars
}

fastify.get('/api/models/', () => ({
  success: true,
  models: configuration.models
}));

fastify.post('/api/search/', async request => {
  const summaryModelName = /*request.body.summaryModelName ||*/ 'gpt-3.5-turbo';
  const modelName = request.body.modelName || 'openai';

  const query = normalizeQuery(request.body.query);
  if (!query) {
    return {
      success: true,
      isEmpty: true
    };
  }

  const indexedQuery = sanitizeQueryForIndexing(query);

  const searchCandidate = await sequelize.models.Search.findOne({
    where: {
      indexedQuery,
      modelName
    }
  });

  if (searchCandidate) {
    return {
      success: true,
      id: searchCandidate.id,
      results: searchCandidate.results
    };
  }

  const embeddingsResult = await getEmbeddings(modelName, query);
  const embedding = normalizeEmbedding(embeddingsResult[0]);

  const searchResults = await search(configuration, embedding, modelName);

  if (searchResults.length === 0) {
    return {
      success: true,
      isEmpty: true
    };
  }

  searchResults.forEach(entry => entry.videoId = configuration.lectures[entry.lecture - 1]);

  const newRecord = await sequelize.models.Search.create({
    query,
    indexedQuery,
    modelName,
    embedding,
    results: searchResults
  });

  const shortResults = shorten(searchResults);
  createSummary(newRecord.id, query, summaryModelName, shortResults); // async task

  return {
    success: true,
    id: newRecord.id,
    results: searchResults
  };
});

fastify.get('/api/search/:id', async (request, reply) => {
  const { id } = request.params;

  const record = await sequelize.models.Search.findByPk(id);
  if (!record) {
    reply.code(404);
    return {
      success: false
    };
  }

  if (record.summary === null) {
    return {
      success: true,
      isProcessing: true
    };
  }

  return {
    success: true,
    summary: record.summary
  };
});

fastify.post('/api/share/', async (request, reply) => {
  const { id } = request.body;
  const searchCandidate = await sequelize.models.Search.findByPk(id);
  if (!searchCandidate) {
    reply.code(404);
    return {
      success: false
    };
  }

  searchCandidate.share();
  await searchCandidate.save();

  return {
    success: true,
    shareId: searchCandidate.shareId
  };
});

fastify.get('/api/shared/:shareId', async (request, reply) => {
  const { shareId } = request.params;

  const searchCandidate = await sequelize.models.Search.findOne({
    where: {
      shareId
    }
  });

  if (!searchCandidate) {
    reply.code(404);
    return {
      success: false
    };
  }

  return {
    success: true,
    id: searchCandidate.id,
    modelName: searchCandidate.modelName,
    query: searchCandidate.query,
    results: searchCandidate.results,
    summary: searchCandidate.summary
  };
});

fastify.listen(
  {
    port: process.env.LISTEN_PORT,
    host: process.env.LISTEN_HOST
  },
  (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);

    if (process.send) {
      process.send('ready');
    }
  }
);
