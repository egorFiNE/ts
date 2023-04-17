import 'dotenv/config';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "Convert OpenAI's whisper output to text", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

function convertSecondsToHMS(s) {
  const d = new Date(0);
  d.setSeconds(s);

  return [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0')
  ].join(':') + ',000';
}

function convert(entry) {
  return [
    '[',
    convertSecondsToHMS(entry.start),
    ' --> ',
    convertSecondsToHMS(entry.end),
    '] ',
    entry.text
  ].join('');
}

const json = JSON.parse(fs.readFileSync(argv.filename, 'utf8'));

const lines = json.segments.map(convert);

const textFilename = argv.filename.replaceAll('.json', '.txt');
fs.writeFileSync(textFilename, lines.join("\n") + "\n");
