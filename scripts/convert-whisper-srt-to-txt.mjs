import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "Convert whisper srt output to txt", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

const srt = fs.readFileSync(argv.filename).toString()
  .split('\n\n')
  .map(str => {
    if (str.trim() == '') {
      return '';
    }

    const s = str.split('\n');
    return '['  + s[1] + '] ' + s[2].trim();
  })
  .filter(s => s.length > 0);

const txtFilename = argv.filename.replace('.srt', '.txt');

fs.writeFileSync(txtFilename, srt.join("\n") + "\n");
