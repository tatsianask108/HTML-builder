const fs = require('fs');
const path = require('path');

const myFilePath = path.join(__dirname, './text.txt');

const myReadStream = fs.createReadStream(myFilePath);

myReadStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
