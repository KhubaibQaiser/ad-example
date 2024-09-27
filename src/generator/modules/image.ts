import sharp from 'sharp';

export async function processImageAsset(inputPath: string, outputPath: string, ext: string, width: number, quality: number) {
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
