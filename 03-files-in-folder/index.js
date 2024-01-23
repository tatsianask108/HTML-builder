const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function outputToConsole() {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    files.forEach(async (file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileCutName = path.basename(filePath, path.extname(filePath));
        const fileExtension = path.extname(file.name).slice(1);
        const { size } = await fs.stat(filePath);
        console.log(`${fileCutName} - ${fileExtension} - ${size}B`);
      }
    });
 
}

outputToConsole();
