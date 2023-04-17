import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "Convert json from whisper to txt", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

function convert(entry) {
  return [
    '[',
    entry.timestamps.from,
    ' --> ',
    entry.timestamps.t,
    '] ',
    entry.text
  ].join('');
}

const json = JSON.parse(fs.readFileSync(argv.filename, 'utf8'));

const lines = json.segments.map(convert);

const textFilename = argv.filename.replaceAll('.json', '.txt');
fs.writeFileSync(textFilename, lines.join("\n") + "\n");
