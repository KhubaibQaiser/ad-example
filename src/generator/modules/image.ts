import fsExtra from 'fs-extra/esm';
import sharp from 'sharp';

export async function processImageAsset(inputPath: string, outputPath: string, ext: string, width: number, quality: number) {
  try {
    if (ext.includes('svg')) {
      await fsExtra.copy(inputPath, outputPath);
    } else if (ext.includes('png')) {
      await sharp(inputPath).resize(width, undefined, { withoutEnlargement: true }).png({ quality, progressive: true }).toFile(outputPath);
    } else {
      await sharp(inputPath).resize(width, undefined, { withoutEnlargement: true }).jpeg({ quality, progressive: true }).toFile(outputPath);
    }
  } catch (error) {
    console.error(`Error processing file ${inputPath}:`, error);
  }
}
