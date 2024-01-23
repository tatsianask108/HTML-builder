const fs = require('fs/promises');
const path = require('path');

const initialFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyDir(initial, copy) {
    await fs.mkdir(copy, { recursive: true });
    const initFolderFiles = await fs.readdir(initial);
    const copyFolderFiles = await fs.readdir(copy);
    for (const file of copyFolderFiles) {
      const copyFolderPath = path.join(copy, file);
      if (!initFolderFiles.includes(file)) {
        await fs.rm(copyFolderPath, { recursive: true });
      }
    }

    for (const file of initFolderFiles) {
      const initFolderPath = path.join(initial, file);
      const copyFolderPath = path.join(copy, file);
      const stat = await fs.stat(initFolderPath);
      if (stat.isDirectory()) {
        await copyDir(initFolderPath, copyFolderPath);
      } else {
        await fs.copyFile(initFolderPath, copyFolderPath);
      }
    }
}

copyDir(initialFolder, copyFolder);
