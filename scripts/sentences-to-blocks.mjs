import 'dotenv/config';
import fs from 'fs';
import json5 from 'json5';
import { init } from '../models/index.mjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const sequelize = await init();

function getWords(words, atPos, wordCount, leftoverWordCount) {
  if (atPos >= words.length) {
    return null;
  }

  let isLast = false;

  let count = wordCount;
  if (words.length - atPos + count <= leftoverWordCount) {
    isLast = true;
    count = words.length; // esssentially max value
  }

  const wordsEntries = words.slice(atPos, atPos + count);
  const text = wordsEntries.map(w => w[0]).join(' ');
  const start = wordsEntries[0][1];

  const last = wordsEntries.at(-1);
  const end = last[1] + last[2];

  return {
    text,
    start,
    end,
    isLast
  };
}

function getChunksByLength(words, wordCount, leftoverWordCount, overlapWordCount) {
  const chunks = [];

  let pos = 0;
  let chunk = null;
  while (chunk = getWords(words, pos, wordCount, leftoverWordCount)) {
    chunks.push(chunk);

    if (chunk.isLast) {
      break;
    }

    pos += wordCount - overlapWordCount;
  }

  return chunks;
}

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename> <lecture>', "Glue sentences to contexts", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
      .positional('lecture', {
        type: 'number'
      })
  })
  .parse();

const configuration = json5.parse(fs.readFileSync('../configuration.json5'));

const source = JSON.parse(fs.readFileSync(argv.filename));
const words = [];

for (const { text, start, end } of source) {
  const seconds = end - start;
  const millisecondsPerChar = seconds / text.replace(/\s+/g, '').length;

  let pos = start;

  for (const word of text.split(/\s+/)) {
    const secondsLength = Math.ceil(millisecondsPerChar * word.length);
    words.push([ word, pos, secondsLength ]);
    pos += secondsLength;
  }
}

console.log("Got words", words.length);

// let accumulator = 0, count = 0;
// for (const [ word ] of words) {
//   if (word.length <= 3) {
//     continue;
//   }

//   accumulator += word.length;
//   count++;
// }

// const AVG_WORD_SIZE = Math.round(accumulator/count);

await sequelize.models.Chunk.destroy({
  where: {
    lecture: argv.lecture
  }
});

source.forEach((entry, index) => {
  entry.sequence = index;
  entry.lecture = argv.lecture
});

for (const { wordCount, leftoverWordCount, overlapWordCount } of configuration.contexts) {
  const chunks = getChunksByLength(words, wordCount, leftoverWordCount, overlapWordCount);

  chunks.forEach((chunk, index) => {
    chunk.sequence = index;
    chunk.wordCount = wordCount;
    chunk.lecture = argv.lecture;
  });

  for (const modelName of configuration.models) {
    chunks.forEach(chunk => chunk.modelName = modelName);
    await sequelize.models.Chunk.bulkCreate(chunks);
    console.log(`${wordCount} word count model ${modelName} saved`);
  }
}

await sequelize.close();
