const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/text.txt';
const writableStream = fs.createWriteStream(filePath);

const writeStream = fs.createWriteStream(filePath);

const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

console.log('Welcome!');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    writableStream.end();
    process.exit();
  }
  writeStream.write(input + '\n');
});

rl.on('SIGINT', () => {
  console.log('Goodbye!');
  writeStream.end();
  process.exit();
});
