const path = require('path');
const config = require('../config').default;
const { isImage } = require('../utils');
const { downloadFile } = require('../api');

function downloadAndPlaceAsset({ assetUrl, ext, assetName, outAssetName, downloadPromises }) {
  let extensionFromAsset = path.extname(assetUrl).toLowerCase();
  extensionFromAsset = extensionFromAsset.startsWith('.') ? extensionFromAsset.slice(1) : extensionFromAsset;
  extensionFromAsset = isImage(extensionFromAsset) ? 'webp' : extensionFromAsset;
  const extension = ext ?? extensionFromAsset;
  const downloadPath = path.join(config.tempDownloadDir, `${outAssetName ?? assetName}.${extension}`);
  downloadPromises.push(downloadFile(assetUrl, downloadPath));
  return path.join('assets', `${outAssetName ?? assetName}.${extension}`);
}

module.exports = { downloadAndPlaceAsset };
