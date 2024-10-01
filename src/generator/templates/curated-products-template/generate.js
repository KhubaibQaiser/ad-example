import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import { config } from '@/generator/config';
import { downloadAndPlaceAsset } from '@/generator/modules/file';
import { processAssets } from '@/generator/modules/asset-compression';
import { minifyCss, minifyHtml, minifyJs, renderTemplate } from '@/generator/utils';

// Function to download and process assets
async function downloadRemoteAssetsToTempDir({ data, outputAssetsDir, width, quality }) {
  const suggestionImageRatio = 0.4; // 64/160 - suggestion div size / ad unit size
  const suggestionImageWidth = width * suggestionImageRatio * 1.5;

  await fsExtra.ensureDir(outputAssetsDir);
  const downloadPromises = [];

  console.log('Downloading assets...');

  // Download and process image_url
  if (data.image_url) {
    data.image_url = downloadAndPlaceAsset({ assetUrl: data.image_url, assetName: 'main_image', downloadPromises });
  }

  const moduleData = data.moduleData;

  if (moduleData.srcURL) {
    moduleData.srcURL = downloadAndPlaceAsset({
      assetUrl: moduleData.srcURL,
      assetName: `asset_${moduleData.media}_${0}`,
      downloadPromises,
    });
  }

  if (moduleData.backdropUrl) {
    moduleData.backdropUrl = downloadAndPlaceAsset({
      assetUrl: moduleData.backdropUrl,
      assetName: `backdrop_${0}`,
      downloadPromises,
    });
  }

  for (let j = 0; j < moduleData.products.length; j++) {
    const product = moduleData.products[j];

    if (product.image) {
      product.image = downloadAndPlaceAsset({
        assetUrl: product.image,
        assetName: `product_${0}_${j}`,
        outAssetName: `product_${0}_${j}_w_${suggestionImageWidth}`,
        downloadPromises,
        ext: 'webp',
      });

      product.handle = `${data.product_base_url}${product.handle}`;
    }
  }

  await Promise.all(downloadPromises);
  console.log('Downloaded assets successfully!');
  console.log('Processing assets...');
  await processAssets(config.tempDownloadDir, outputAssetsDir, width, quality);
  console.log('Processed images successfully!');
}

// function validateData(_d, templateDir) {
//   const schema = require(path.join(templateDir, 'validation-schema.js'));
//   const validationResult = schema.safeParse(_d);
//   if (!validationResult.success) {
//     console.error('Validation errors:', validationResult.error);
//     // throw new Error(validationResult.error);
//   }
// }

export async function generate(_data, outputAdDir, templateDir, width, quality) {
  try {
    let data = JSON.parse(JSON.stringify(_data));
    // Use only first since it's a single moduleData template
    data = { ...data, moduleData: data.moduleData[0] };

    // validateData(data,templateDir);

    const outputAdAssetsDir = path.join(outputAdDir, 'assets');
    await fsExtra.ensureDir(outputAdAssetsDir);

    await downloadRemoteAssetsToTempDir({ data, outputAssetsDir: outputAdAssetsDir, width, quality });

    console.log('Rendering template...', data);

    const html = renderTemplate(path.join(templateDir, 'index.html'), data);
    const minifiedHtml = await minifyHtml(html);
    fs.writeFileSync(path.join(outputAdDir, 'index.html'), minifiedHtml);

    const minifiedCss = minifyCss(path.join(templateDir, 'style.css'));
    fs.writeFileSync(path.join(outputAdDir, 'style.css'), minifiedCss);

    const minifiedJs = await minifyJs(path.join(templateDir, 'script.js'));
    fs.writeFileSync(path.join(outputAdDir, 'script.js'), minifiedJs);

    const minifiedAmplitudeJs = await minifyJs(path.join(templateDir, 'amplitude-tracking.js'));
    fs.writeFileSync(path.join(outputAdDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);

    // Copy assets from the input template folder
    const templateAssetsDir = path.join(templateDir, 'assets');
    await fsExtra.ensureDir(templateAssetsDir);
    await processAssets(templateAssetsDir, outputAdAssetsDir, width, quality);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}
