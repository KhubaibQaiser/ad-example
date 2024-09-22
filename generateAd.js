const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const config = require('./src/config.js').default;
const { fetchData } = require('./src/api.js');
const { minifyHtml, minifyJs, renderTemplate, getSlug } = require('./src/utils.js');

const { tempDownloadDir, outputRootDir } = config;

async function copyGlobalFiles(outputDir) {
  // Copy all files from the global folder to the output directory
  const globalDir = path.join(__dirname, 'global');
  if (fs.existsSync(globalDir)) {
    const files = fs.readdirSync(globalDir);
    for (const file of files) {
      const filePath = path.join(globalDir, file);
      const outputFilePath = path.join(outputDir, file);
      let minifiedContent = await minifyJs(filePath);
      if (file === 'amplitude-wrapper.min.js') {
        minifiedContent = minifiedContent.replace('AMPLITUDE_API_KEY', process.env.AMPLITUDE_API_KEY);
        minifiedContent = minifiedContent.replace('ENV_PLACEHOLDER', process.env.NODE_ENV || 'development');
      }
      fs.writeFileSync(path.join(outputFilePath), minifiedContent);
    }
  }
}

async function downloadAndSaveData() {
  const response = await fetchData();
  if (!response) {
    throw new Error('No data found!');
  }
  console.log('Storing data to file...');
  const dataFilePath = path.join(__dirname, 'data', 'data.json');
  fsExtra.ensureFileSync(dataFilePath);
  fs.writeFileSync(dataFilePath, JSON.stringify(response));
  console.log('Data stored to file successfully!');
  return response;
}

// Main function to generate ads
async function generateAd() {
  let outputAdRootDir = '';

  try {
    const templatesDir = path.join(__dirname, 'templates');
    await fsExtra.ensureDir(tempDownloadDir);

    const data = await downloadAndSaveData();

    const slug = data.handle ?? getSlug(data.title);
    outputAdRootDir = path.join(outputRootDir, slug);
    const outputDir = path.join(outputAdRootDir, 'ad');
    await fsExtra.ensureDir(outputDir);

    const templateName = 'template'; // Get template name from build args
    const generateScriptPath = path.join(templatesDir, templateName, 'generate.js');
    const { generate } = require(generateScriptPath);
    await generate(data, outputDir);

    await copyGlobalFiles(outputDir);

    // Copy ad.html to the output directory root and rename it to index.html
    const adHtml = renderTemplate(path.join(__dirname, 'ad.html'), { title: data.title, width: config.width, height: config.height });
    const minifiedAdHtml = minifyHtml(adHtml);
    fs.writeFileSync(path.join(outputRootDir, slug, 'index.html'), minifiedAdHtml);

    console.log(`Ad has been generated successfully in the '${outputRootDir}/${slug}' folder!`);

    // Open the generated index.html file
    const { default: open } = await import('open');
    await open(path.join(outputRootDir, slug, 'index.html'));
  } catch (error) {
    console.error('Error generating files:', error);
    if (fs.existsSync(outputAdRootDir)) {
      console.log('Removing output directory...');
      await fsExtra.remove(outputAdRootDir);
    }
  } finally {
    // Remove the temporary download directory
    console.log('Removing temporary download directory...');
    await fsExtra.remove(tempDownloadDir);
  }
}

// Run the function
generateAd();
