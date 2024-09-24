const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');

const { processAssets } = require('../../src/modules/asset-compression');
const { renderTemplate, minifyHtml, minifyCss, minifyJs } = require('../../src/utils');
const { downloadAndPlaceAsset } = require('../../src/modules/file');
const { config } = require('../../src/config');

const suggestionImageRatio = 0.4; // 64/160 - suggestion div size / ad unit size
const suggestionImageWidth = config.width * suggestionImageRatio * 1.5;

// Function to download and process assets
async function downloadRemoteAssetsToTempDir(data, assetsDir) {
  await fsExtra.ensureDir(assetsDir);
  const downloadPromises = [];

  console.log('Downloading assets...');

  // Download and process image_url
  if (data.image_url) {
    data.image_url = downloadAndPlaceAsset({ assetUrl: data.image_url, assetName: 'main_image', assetsDir, downloadPromises });
  }

  const module = data.moduleData;

  if (module.srcURL) {
    module.srcURL = downloadAndPlaceAsset({
      assetUrl: module.srcURL,
      assetName: `asset_${module.media}_${0}`,
      assetsDir,
      downloadPromises,
    });
  }

  if (module.backdropUrl) {
    module.backdropUrl = downloadAndPlaceAsset({
      assetUrl: module.backdropUrl,
      assetName: `backdrop_${0}`,
      assetsDir,
      downloadPromises,
    });
  }

  for (let j = 0; j < module.products.length; j++) {
    const product = module.products[j];

    if (product.image) {
      product.image = downloadAndPlaceAsset({
        assetUrl: product.image,
        assetName: `product_${0}_${j}`,
        outAssetName: `product_${0}_${j}_w_${suggestionImageWidth}`,
        assetsDir,
        downloadPromises,
        ext: 'webp',
      });

      const handleBaseUrl = `${process.env.STORE_URL}/${data.collection_handle}/products/`;
      product.handle = `${handleBaseUrl}${product.handle}`;
    }
  }

  await Promise.all(downloadPromises);
  console.log('Downloaded assets successfully!');
  console.log('Processing assets...');
  await processAssets(config.tempDownloadDir, assetsDir, config.width, config.quality);
  console.log('Processed images successfully!');
}

function validateData(_d) {
  const schema = require(path.join(__dirname, 'validation-schema.js'));
  const validationResult = schema.safeParse(_d);
  if (!validationResult.success) {
    console.error('Validation errors:', validationResult.error);
    // throw new Error(validationResult.error);
  }
}

async function generate(_data, outputDir) {
  try {
    let data = JSON.parse(JSON.stringify(_data));
    // Use only first since it's a single module template
    data = { ...data, moduleData: data.moduleData[0] };

    validateData(data);

    const outputAssetsDir = path.join(outputDir, 'assets');
    await fsExtra.ensureDir(outputAssetsDir);

    await downloadRemoteAssetsToTempDir(data, outputAssetsDir);

    const html = renderTemplate(path.join(__dirname, 'index.html'), data);
    const minifiedHtml = minifyHtml(html);
    fs.writeFileSync(path.join(outputDir, 'index.html'), minifiedHtml);

    const minifiedCss = minifyCss(path.join(__dirname, 'style.css'));
    fs.writeFileSync(path.join(outputDir, 'style.css'), minifiedCss);

    const minifiedJs = await minifyJs(path.join(__dirname, 'script.js'));
    fs.writeFileSync(path.join(outputDir, 'script.js'), minifiedJs);

    // const minifiedAmplitudeJs = await minifyJs(path.join(__dirname, 'amplitude-tracking.js'));
    // fs.writeFileSync(path.join(outputDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);

    const templateAssetsDir = path.join(__dirname, 'assets');
    await fsExtra.ensureDir(templateAssetsDir);

    await processAssets(templateAssetsDir, outputAssetsDir, config.width, config.quality);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

module.exports = { generate };
