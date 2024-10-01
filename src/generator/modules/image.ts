import sharp from 'sharp';

export async function processImageAsset(inputPath: string, outputPath: string, ext: string, width: number, quality: number) {
  try {
    await sharp(inputPath)
      .resize(width, undefined, { withoutEnlargement: true }) // Resize to the specified width, maintaining aspect ratio
      .jpeg({ quality }) // Convert to jpeg format with the specified quality
      .toFile(outputPath.replace(ext, '.jpeg'));
  } catch (error) {
    console.error(`Error processing file ${inputPath}:`, error);
  }
}
