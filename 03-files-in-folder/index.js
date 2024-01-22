const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function outputToConsole() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    files.forEach(async (file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const { size } = await fs.stat(filePath);
        const fileExtension = path.extname(file.name).slice(1);
        console.log(`${file.name} - ${fileExtension} - ${size}B`);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

outputToConsole();
