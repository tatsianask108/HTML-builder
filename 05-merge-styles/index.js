const fs = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundledFile = path.join(bundlePath, 'bundle.css');

async function compileStyles() {
  try {
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const oneCssFile = [];
    for (const cssFile of cssFiles) {
      const content = await fs.readFile(path.join(stylesPath, cssFile), 'utf-8');
      oneCssFile.push(content);
    }
    const bundledCssFile = oneCssFile.join('\n');
    await fs.writeFile(bundledFile, bundledCssFile, 'utf-8');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
compileStyles();
