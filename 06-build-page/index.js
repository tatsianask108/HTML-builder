//create project-dist folder and copy assets
const fs = require('fs/promises');
const path = require('path');

const initialFolder = path.join(__dirname, 'assets');
const distFolder = path.join(__dirname, 'project-dist');
const copyFolder = path.join(distFolder, 'assets');

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

//merge styles
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundledFile = path.join(bundlePath, 'style.css');

async function compileStyles() {
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const oneCssFile = [];
    for (const file of cssFiles) {
      const content = await fs.readFile(path.join(stylesPath, file), 'utf-8');
      oneCssFile.push(content);
    }
    const bundledCssFile = oneCssFile.join('\n');
    await fs.writeFile(bundledFile, bundledCssFile, 'utf-8');
}
compileStyles();

//bundle html
const templatePath = path.join(__dirname, 'template.html');
const htmlDistPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');

async function replaceTemplateTags(template, components, output) {
    const templateHtml = await fs.readFile(template, 'utf-8');
    const templateTags = templateHtml.match(/\{\{(\w+)\}\}/g);

    if (templateTags) {
      let bundledHtml = templateHtml;
      for (const tag of templateTags) {
        const tagName = tag.slice(2, -2);
        const componentFilePath = path.join(components, `${tagName}.html`);

       
          if (path.extname(componentFilePath) === '.html') {
            const componentHtml = await fs.readFile(
              componentFilePath,
              'utf-8',
            );
            bundledHtml = bundledHtml.replace(tag, componentHtml);
          }
      
      }
      await fs.writeFile(output, bundledHtml, 'utf-8');
    }
}

replaceTemplateTags(templatePath, componentsPath, htmlDistPath);
