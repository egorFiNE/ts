import 'dotenv/config';
import { init } from '../models/index.mjs';
import { getEmbeddings, normalizeEmbedding } from '../lib/Embeddings.mjs';
import { search, summarize, shorten } from '../lib/Search.mjs';
import fs from 'fs';
import JSON5 from 'json5';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .options({
    summarize: {
      type: Boolean
    }
  })
  .command('* <model>', "Search in model", yargs => {
    yargs
      .positional('model', {
        type: 'string'
      })
  })
  .parse();

const sequelize = await init();
const configuration = JSON5.parse(fs.readFileSync('../configuration.json5'));

const query = 'why nations came to be?';

const embeddingsResult = await getEmbeddings(argv.model, [ query ]);
const embedding = normalizeEmbedding(embeddingsResult[0]);

console.log("Got embedding for query");

let searchResults = await search(configuration, embedding, argv.model);
const shortResults = shorten(searchResults);

console.log(shortResults);

await sequelize.close();

if (!argv.summarize) {
  process.exit(0);
}

console.log('-'.repeat(120));

const summary = await summarize(query, 'gpt-3.5-turbo', shortResults);
console.log(summary);
