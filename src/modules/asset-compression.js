const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const config = require('../config').default;

const { processImageAsset } = require('./image');
const { processVideoAsset } = require('./video');
const { isImage } = require('../utils');

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
        await processVideoAsset(inputPath, outputPath, w, config.compressVideos);
      }
    }
  }
}

module.exports = { processAssets };
