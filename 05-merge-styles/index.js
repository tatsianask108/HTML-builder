const fs = require('fs/promises');
const path = require('path');

const stylesPath = './05-merge-styles/styles';
const bundlePath = './05-merge-styles/project-dist';
const bundledFile = path.join(bundlePath, 'bundle.css');

async function compileStyles() {
  try {
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const oneCssFile = [];
    for (const file of cssFiles) {
      const content = await fs.readFile(path.join(stylesPath, file), 'utf-8');
      oneCssFile.push(content);
    }
    const bundledCssFile = oneCssFile.join('\n');
    await fs.writeFile(bundledFile, bundledCssFile, 'utf-8');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
compileStyles();
