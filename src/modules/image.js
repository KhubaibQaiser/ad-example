const sharp = require('sharp');

async function processImageAsset(inputPath, outputPath, ext, width, quality) {
  try {
    // console.log('Compressing image: ', inputPath);
    await sharp(inputPath)
      .resize(width, undefined, { withoutEnlargement: true }) // Resize to the specified width, maintaining aspect ratio
      .webp({ quality }) // Convert to WebP format with the specified quality
      .toFile(outputPath.replace(ext, '.webp'));
    // console.log('Compressed image: ', outputPath.replace(ext, '.webp'));
  } catch (error) {
    console.error(`Error processing file ${inputPath}:`, error);
  }
}

module.exports = { processImageAsset };
