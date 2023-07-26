import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .wrap(180)
  .command('* <filename>', "", yargs => {
    yargs
      .positional('filename', {
        type: 'string'
      })
  })
  .parse();

const text = fs.readFileSync(argv.filename).toString();
const blocks = text.split(/#/);
if (blocks[0].trim() !== '') {
  console.log("Zero?!");
  process.exit(0);
}

blocks.shift();

let num = 1;
const externalIds = [];

for (const block of blocks) {
  const nn = block.indexOf('\n');
  const heading = block.substring(0, nn).trim();

  const externalId = heading.match(/\/(\d+)$/);
  externalIds.push(externalId[1]);

  fs.writeFileSync('lecture-' + num + '.txt', block.substring(nn+1).trim() + "\n");
  num++;
}

console.log(externalIds);

// console.log(blocks[0].substring(0, 150));
