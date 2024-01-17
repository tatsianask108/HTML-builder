const fs = require('fs/promises');
const path = require('path');

const initialFolderPath = './04-copy-directory/files';
const copyFolderPath = './04-copy-directory/files-copy';

async function copyDir() {
  await fs.rm(copyFolderPath, { recursive: true });

  try {
    copyDirRecursively(initialFolderPath, copyFolderPath);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

copyDir();

async function copyDirRecursively(initial, copy) {
  await fs.mkdir(copy, { recursive: true });

  const files = await fs.readdir(initial);

  files.forEach(async (file) => {
    const initialFilePath = path.join(initial, file);
    const copyFilePath = path.join(copy, file);
    const stats = await fs.stat(initialFilePath);

    if (stats.isFile()) {
      await fs.copyFile(initialFilePath, copyFilePath);
    } else if (stats.isDirectory()) {
      await copyDirRecursively(initialFilePath, copyFilePath);
    }
  });
}
