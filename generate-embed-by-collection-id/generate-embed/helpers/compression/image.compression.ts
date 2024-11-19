import fsExtra from 'fs-extra';
import sharp from 'sharp';
import { generatorConfig } from '../../config';

export async function compressImageAsset(
    inputPath: string,
    outputPath: string,
    width: number,
    ext: string,
    quality = generatorConfig.imageCompressionQuality,
) {
    try {
        await fsExtra.copy(inputPath, outputPath);
        // if (ext.includes('svg')) {
        //   await fsExtra.copy(inputPath, outputPath);
        // } else if (ext.includes('png')) {
        //   await sharp(inputPath).resize(width, undefined, { withoutEnlargement: true }).png({ quality, progressive: true }).toFile(outputPath);
        // } else {
        //   await sharp(inputPath).resize(width, undefined, { withoutEnlargement: true }).jpeg({ quality, progressive: true }).toFile(outputPath);
        // }
    } catch (error) {
        console.error(`Error processing file ${inputPath}:`, error);
    }
}
