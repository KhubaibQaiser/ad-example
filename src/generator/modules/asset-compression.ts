import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import { config } from '../config';
import { isImage } from '@/generator/utils/generator-utils';
import { processImageAsset } from './image';
import { processVideoAsset } from './video';

// Function to process images
export async function processAssets(inputDir: string, outputDir: string, _width: number, excludeVideo = false) {
  console.log('Processing assets...', { inputDir, outputDir, _width, excludeVideo });
  const width = parseInt(`${_width}`);
  const quality = parseInt(`${config.imageCompressionQuality}`);

  const entries = fs.readdirSync(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fsExtra.ensureDir(outputPath);
      await processAssets(inputDir, outputPath, width, excludeVideo);
    } else if (entry.name.startsWith('.')) {
      // Ignore
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      let w: string | number = width;
      if (inputPath.includes('_w_')) {
        w = inputPath.split('_w_')[1].split('.')[0];
        w = isNaN(parseInt(w)) ? width : parseInt(w);
      }
      if (isImage(ext)) {
        await processImageAsset(inputPath, outputPath, ext, w, quality);
      } else if (!excludeVideo) {
        await processVideoAsset(inputPath, outputPath, w, config.compressVideos, config.videoOutputFormat);
      }
    }
  }
  console.log('Assets compressed successfully!');
}
