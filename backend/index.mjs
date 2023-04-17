import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import json5 from 'json5';
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyStatic from '@fastify/static';
import { init } from '../models/index.mjs';
import { getEmbeddings, normalizeEmbedding } from '../lib/Embeddings.mjs';
import { search, summarize, shorten } from '../lib/Search.mjs';

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

if (process.env.NODE_ENV == 'production') {
  fastify.register(FastifyStatic, {
    root: path.join(process.cwd(), '..', 'frontend-dist')
  });

} else {
  fastify.setErrorHandler(function (error, request, reply) {
    console.error(error);
  });
}

fastify.get('/api/models/', () => ({
  success: true,
  models: configuration.models
}));

fastify.post('/api/search/', async request => {
  const summaryModelName = request.body.summaryModelName || 'gpt-3.5';
  const modelName = request.body.modelName || 'openai';
  const query = request.body.query;

  const searchCandidate = await sequelize.models.Search.findOne({
    where: {
      query,
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

  if (searchResults.length == 0) {
    return {
      success: true,
      isEmpty: true
    };
  }

  searchResults.forEach(entry => entry.videoId = configuration.lectures[entry.lecture-1]);

  const newRecord = await sequelize.models.Search.create({
    query,
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

async function createSummary(id, query, summaryModelName, contextEntries) {
  const record = await sequelize.models.Search.findByPk(id);

  if (process.env.EMULATE_SUMMARY) {
    console.warn("WARNING: emulated summary");

    setTimeout(async () => {
      record.summary = 'Emulated: The lecturer is going to discuss the theoretical origins of nations and explore the question of why nations exist in general. They will examine the deeper forces that lead to nation creation and destruction, and the human choices and circumstances that contribute to the formation of nations. The lecturer emphasizes that nations are a modern historical construct characterized by a sense of solidarity with people you don\'t know. They also mention that history is not about how everything has to be the way it is now, and that sometimes things change, and sometimes they don\'t. The lecturer does not provide a definitive answer to why nations came to be, but rather explores the different factors that contribute to their formation.';
      await record.save();
    }, 2000);

    return;
  }

  record.summary = await summarize(query, summaryModelName, contextEntries);
  await record.save();
}

fastify.get('/api/search/:id', async (request, reply) => {
  const id = request.params.id;

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
  const id = request.body.id;
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
  const shareId = request.params.shareId;

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

