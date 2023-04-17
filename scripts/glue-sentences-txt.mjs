import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "Glue and split sentences", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

function parseTimeStringToMilliSeconds(timeString) {
  const s = timeString.split(':');

  const hours = parseInt(s[0], 10);
  const minutes = parseInt(s[1], 10);
  const milliSeconds = Math.round(parseFloat(s[2].replaceAll(',', '.')) * 1000);
  return (minutes * 60 + hours * 3600) * 1000 + milliSeconds;
}

const lines = fs.readFileSync(argv.filename, 'utf8').toString()
  .split('\n')
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .map(line => {
    const [ timeString, textString ] = line.split(']');
    const [ timeStartString, timeEndString ] = timeString.replaceAll('[', '').split(' --> ');

    return {
      start: parseTimeStringToMilliSeconds(timeStartString),
      end: parseTimeStringToMilliSeconds(timeEndString),
      text: textString.trim()
    };
  });

// split lines by sentences
const splittedLines = [];

const regex = /(?<=[^.][.!?])\s+/g;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const sentences = line.text.split(regex);
  const start = line.start;
  const end = line.end;
  const duration = end - start;
  const durationPerChar = duration / line.text.replaceAll(regex, '').length;

  let currentTime = start;
  for (let j = 0; j < sentences.length; j++) {
    const sentence = sentences[j];
    const sentenceStart = currentTime;
    currentTime += durationPerChar * sentence.length;
    const sentenceEnd = currentTime;

    splittedLines.push({
      text: sentence,
      start: sentenceStart,
      end: sentenceEnd
    });
  }
}

let sentence = '';
let start = null;
const sentences = [];

for (let i = 0; i < splittedLines.length; i++) {
  let text = splittedLines[i].text;

  if (start === null) {
    start = splittedLines[i].start;
  }

  if (sentence.length > 0) {
    text = ' ' + text;
  }
  sentence += text;

  if (['.', '!', '?'].includes(text.slice(-1)) || text.slice(-3) === '...') {
    sentences.push({
      text: sentence.replace(/\s+/g, ' ').trim(),
      start: start,
      end: splittedLines[i].end
    });
    sentence = '';
    start = null;
  }
}

const newFilename = argv.filename.replaceAll('.txt', '.json');

fs.writeFileSync(newFilename, JSON.stringify(sentences, null, 2));
