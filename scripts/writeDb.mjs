import 'dotenv/config';
import fs from 'fs';
import { init } from '../models/index.mjs';
import { normalizeEmbedding } from '../lib/Embeddings.mjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const sequelize = await init();

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename> <model> <entityId>', "Write chunks to db", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
      .positional('model', {
        type: 'string'
      })
      .positional('entityId', {
        type: 'number'
      })
  })
  .parse();

async function store({ messages, entityId, modelName }) {
  await sequelize.transaction(async transaction => {
    for (const { id: chunkId, text, prefix, suffix, embedding, start, end, fullStart, fullEnd } of messages) {

      const embeddingString = '[' + normalizeEmbedding(embedding).join(',') + ']';

      await sequelize.query(
        'INSERT INTO "Chunk" ("text", "prefix", "suffix", "chunkId", "embedding", "start", "end", "fullStart", "fullEnd", "entityId", "modelName") VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        {
          replacements: [
            text,
            prefix,
            suffix,
            chunkId,
            embeddingString,
            Math.round(start),
            Math.round(end),
            Math.round(fullStart),
            Math.round(fullEnd),
            entityId,
            modelName
          ],
          transaction
        }
      );
    }
  });
}

const messages = JSON.parse(fs.readFileSync(argv.filename, 'utf8'));

await sequelize.models.Chunk.destroy({
  where: {
    entityId: argv.entityId,
    modelName: argv.model
  }
});

await store({
  messages,
  entityId: argv.entityId,
  modelName: argv.model
});

console.log('Done');

await sequelize.close();
