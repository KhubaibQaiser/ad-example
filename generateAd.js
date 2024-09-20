const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { processVideoAsset } = require('./src/modules/video.js');
const config = require('./src/config.js').default;
const { processImageAsset } = require('./src/modules/image.js');
const { fetchData } = require('./src/api.js');
const { isImage, minifyHtml, minifyCss, minifyJs, renderTemplate, getSlug, validateData } = require('./src/utils.js');
const { downloadAndPlaceAsset } = require('./src/modules/file.js');

const { width: imageWidth, compressVideos, tempDownloadDir } = config;

const suggestionImageRatio = 0.4; // 64/160 - suggestion div size / ad unit size
const suggestionImageWidth = imageWidth * suggestionImageRatio * 1.5;

// Function to download and process assets
async function downloadAndProcessAssets(data, assetsDir) {
  await fsExtra.ensureDir(assetsDir);
  const downloadPromises = [];

  await fsExtra.ensureDir(tempDownloadDir);

  console.log('Downloading assets...');

  // Download and process image_url
  if (data.image_url) {
    data.image_url = downloadAndPlaceAsset({ assetUrl: data.image_url, assetName: 'main_image', assetsDir, downloadPromises });
  }

  // Download and process moduleData assets
  for (let i = 0; i < data.moduleData.length; i++) {
    const module = data.moduleData[i];

    if (module.srcURL) {
      module.srcURL = downloadAndPlaceAsset({
        assetUrl: module.srcURL,
        assetName: `asset_${module.media}_${i}`,
        assetsDir,
        downloadPromises,
      });
    }

    if (module.backdropUrl) {
      module.backdropUrl = downloadAndPlaceAsset({
        assetUrl: module.backdropUrl,
        assetName: `backdrop_${i}`,
        assetsDir,
        downloadPromises,
      });
    }

    for (let j = 0; j < module.products.length; j++) {
      const product = module.products[j];

      if (product.image) {
        product.image = downloadAndPlaceAsset({
          assetUrl: product.image,
          assetName: `product_${i}_${j}`,
          outAssetName: `product_${i}_${j}_w_${suggestionImageWidth}`,
          assetsDir,
          downloadPromises,
          ext: 'webp',
        });

        const handleBaseUrl = `${process.env.STORE_URL}/${data.collection_handle}/products/`;
        product.handle = `${handleBaseUrl}${product.handle}`;
      }
    }
  }

  await Promise.all(downloadPromises);
  console.log('Downloaded assets successfully!');
  console.log('Processing assets...');
  await processAssets(tempDownloadDir, assetsDir, imageWidth, config.quality);
  console.log('Processed images successfully!');
}

// Function to process images
async function processAssets(inputDir, outputDir, _width, _quality) {
  const width = parseInt(_width);
  const quality = parseInt(_quality);

  const entries = fs.readdirSync(inputDir, { withFileTypes: true });
  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fsExtra.ensureDir(outputPath);
      await processAssets(inputPath, outputPath, width, quality);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      let w = width;
      if (inputPath.includes('_w_')) {
        w = inputPath.split('_w_')[1].split('.')[0];
        w = isNaN(parseInt(w)) ? width : parseInt(w);
      }
      if (isImage(ext)) {
        await processImageAsset(inputPath, outputPath, ext, w, quality);
      } else {
        // fs.copyFileSync(inputPath, outputPath);
        // console.warn(`Unsupported file format: ${inputPath}`);
        await processVideoAsset(inputPath, outputPath, w, compressVideos);
      }
    }
  }
}

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

// Main function to generate ads
async function generateAd() {
  try {
    await fetchData();

    const dataPath = path.join(__dirname, 'data', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    validateData(data);

    // const assetsDir = 'assets';
    // updateAssetPaths(data, assetsDir);

    const outputRootDir = 'ads';
    const slug = data.handle || getSlug(data.title);
    const outputDir = path.join(outputRootDir, slug, 'ad');
    await fsExtra.ensureDir(outputDir);

    const outputAssetsDir = path.join(outputDir, 'assets');

    await downloadAndProcessAssets(data, outputAssetsDir);

    const html = renderTemplate(path.join(__dirname, 'template', 'index.html'), data);
    const minifiedHtml = minifyHtml(html);
    fs.writeFileSync(path.join(outputDir, 'index.html'), minifiedHtml);

    const minifiedCss = minifyCss(path.join(__dirname, 'template', 'style.css'));
    fs.writeFileSync(path.join(outputDir, 'style.css'), minifiedCss);

    const minifiedJs = await minifyJs(path.join(__dirname, 'template', 'script.js'));
    fs.writeFileSync(path.join(outputDir, 'script.js'), minifiedJs);

    const minifiedAmplitudeJs = await minifyJs(path.join(__dirname, 'template', 'amplitude-tracking.js'));
    fs.writeFileSync(path.join(outputDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);

    const templateAssetsDir = path.join(__dirname, 'template', 'assets');
    await fsExtra.ensureDir(templateAssetsDir);
    await fsExtra.ensureDir(outputAssetsDir);
    await processAssets(templateAssetsDir, outputAssetsDir, imageWidth, config.quality);

    const dataAssetsDir = path.join(__dirname, 'data', 'assets');
    if (fs.existsSync(dataAssetsDir)) {
      await processAssets(dataAssetsDir, outputAssetsDir, imageWidth, config.quality);
    }

    await copyGlobalFiles(outputDir);

    // Copy ad.html to the output directory root and rename it to index.html
    const adHtml = renderTemplate(path.join(__dirname, 'ad.html'), { title: data.title, width: config.width, height: config.height });
    const minifiedAdHtml = minifyHtml(adHtml);
    fs.writeFileSync(path.join(outputRootDir, slug, 'index.html'), minifiedAdHtml);

    console.log(`Ad has been generated successfully in the '${outputRootDir}/${slug}' folder!`);

    // Dynamically import 'open' and open the generated index.html file
    const { default: open } = await import('open');
    await open(path.join(outputRootDir, slug, 'index.html'));
  } catch (error) {
    console.error('Error generating files:', error);
  } finally {
    // Remove the temporary download directory
    console.log('Removing temporary download directory...');
    await fsExtra.remove(tempDownloadDir);
  }
}

// Run the function
generateAd();
