const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const fileName = 'text.txt';
const outputFilePath = path.join(__dirname, fileName);
const writableStream = fs.createWriteStream(outputFilePath);
const writeStream = fs.createWriteStream(outputFilePath, {
  encoding: 'utf8',
});
const rl = readline.createInterface(stdin, stdout);

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
