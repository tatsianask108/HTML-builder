//create project-dist folder and copy assets
const fs = require('fs/promises');
const path = require('path');

const initialFolderPath = './06-build-page/assets';
const copyFolderPath = './06-build-page/project-dist/assets';

async function copyDir() {
  try {
    try {
      await fs.access(copyFolderPath);
      await fs.rm(copyFolderPath, { recursive: true });
    } catch (error) {
      await fs.mkdir(copyFolderPath, { recursive: true });
    }
    await copyDirRecursively(initialFolderPath, copyFolderPath);
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

//merge styles
const stylesPath = './06-build-page/styles';
const bundlePath = './06-build-page/project-dist';
const bundledFile = path.join(bundlePath, 'style.css');

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

//bundle html
const templatePath = './06-build-page/template.html';
const htmlDistPath = './06-build-page/project-dist/index.html';
const componentsPath = './06-build-page/components';

async function replaceTemplateTags(template, components, output) {
  try {
    const templateContent = await fs.readFile(template, 'utf-8');
    const templateTags = templateContent.match(/\{\{(\w+)\}\}/g);

    if (templateTags) {
      let modifiedContent = templateContent;
      for (const tag of templateTags) {
        const tagName = tag.slice(2, -2);
        const componentFilePath = path.join(components, `${tagName}.html`);

        try {
          if (path.extname(componentFilePath).toLowerCase() === '.html') {
            const componentContent = await fs.readFile(
              componentFilePath,
              'utf-8',
            );
            modifiedContent = modifiedContent.replace(tag, componentContent);
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
      await fs.writeFile(output, modifiedContent, 'utf-8');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

replaceTemplateTags(templatePath, componentsPath, htmlDistPath);
