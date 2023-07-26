import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function parseTimeStringToMilliSeconds(timeString) {
  const s = timeString.split(':');

  const hours = parseInt(s[0], 10);
  const minutes = parseInt(s[1], 10);
  const milliSeconds = Math.round(parseFloat(s[2].replaceAll(',', '.')) * 1000);
  return (minutes * 60 + hours * 3600) * 1000 + milliSeconds;
}

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

let c = 0;
let lastTimeMs = 0;
let filenum = 59;

let lines = [];

fs.readFileSync(argv.filename).toString()
  .split('\n')
  .forEach(str => {
    c++;

    if (str.trim() == '') {
      return;
    }

    const firstPos = str.indexOf('[');
    if (firstPos < 0) {
      console.log(c, 'no [');
      process.exit(0);
    }

    let _str = str.substring(firstPos);

    const s = _str.split(']');
    if (s.length !== 2) {
      console.log('line', c, _str);
      process.exit(0);
    }

    // const q = s[0].split(/\s+/);
    // for (let ii=0; ii<q.length; ii++) {
    //   console.log(q[ii].length, '"' + q[ii] + '"');
    // }
    // console.log();

    if (s[0].length !== 30) {
      console.log('time', s[0].length, c, '"' + s[0] + '"');
      process.exit(0);
    }

    const text = s[1].replace(/\s+/g, ' ').trim();
    const [ timeStartString, timeEndString ] = s[0].replaceAll('[', '').split(' --> ');

    const timeMs = parseTimeStringToMilliSeconds(timeStartString);
    if (timeMs < lastTimeMs) {
      console.log(c, "break");
      const filename = 'out-' + String(filenum).padStart(2, '0') + '.txt';
      fs.writeFileSync(filename, lines.join('\n') + '\n');
      lines = [];
      filenum++;
    }

    lastTimeMs = timeMs;

    lines.push(`[${timeStartString} --> ${timeEndString}] ${text}`);
  });

if (lines.length > 0) {
  const filename = 'out-' + String(filenum).padStart(2, '0') + '.txt';
  fs.writeFileSync(filename, lines.join('\n') + '\n');
}
