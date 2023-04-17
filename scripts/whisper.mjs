import 'dotenv/config';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "Parse audio", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const file = fs.createReadStream(argv.filename);

const result = await openai.createTranscription(
  file,
  'whisper-1',
  undefined,
  'verbose_json',
  0,
  'en',
  {
    maxBodyLength: Infinity
  }
);

const newFilename = argv.filename
  .replaceAll('m4a', 'json')
  .replaceAll('mp3', 'json');

fs.writeFileSync(newFilename, JSON.stringify(result.data) + "\n");
