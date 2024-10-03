import fs from 'fs';

import ffmpeg from 'fluent-ffmpeg';
import { config } from '../config';
// if (process.env.NODE_ENV === 'production') {
//   // Path to the local FFmpeg binary
//   const ffmpegPath = path.join(__dirname, 'lib', 'ffmpeg');
//   // Set the path to the FFmpeg binary
//   ffmpeg.setFfmpegPath(ffmpegPath);
// }

export function processVideoAsset(inputPath: string, outputPath: string, width: number, compressVideos = true, _format?: string) {
  if (!compressVideos) {
    // !Important: Video compression is not supported on servers without FFmpeg installed
    console.warn('Skipping video compression...');
    fs.copyFileSync(inputPath, outputPath);
    return;
  }
  const format = _format ?? config.videoOutputFormat;
  if (format === 'mp4') {
    return convertToVideo(inputPath, outputPath, width, format);
  }
  return convertToGif(inputPath, outputPath, width);
}

function convertToVideo(inputPath: string, outputPath: string, width: number, format: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .toFormat(format)
      .videoCodec('libx264')
      .fps(23.98)
      // .preset('divx')
      .noAudio()
      .size(`${width}x?`) // Resize to the specified width, maintaining aspect ratio
      .videoBitrate('1000k') // Set video bitrate
      .outputOptions(['-crf 33', '-pass 1'])
      .on('error', reject)
      .on('progress', (progress) => {
        console.log('Video Compression Progress:', progress.frames);
      })
      .on('end', () => {
        console.log('Video compression and resizing complete!', inputPath);
        resolve('Video compression and resizing complete!');
      })
      .run();
  });
}

function convertToGif(inputPath: string, outputPath: string, width: number) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .toFormat('gif')
      .noAudio()
      // .size(`${width}x?`) // Resize to the specified width, maintaining aspect ratio
      .outputOptions([
        `-vf fps=25,scale=${width}:-1:flags=lanczos`, // Resize to the specified width using Lanczos resampling, set frame rate to 25 fps
        '-crf 40', // Set constant rate factor for quality (lower value means higher quality)
        '-b:v 500k', // Set video bitrate
        // '-fs 1.5M', // Limit the file size
      ])
      .on('error', reject)
      .on('progress', (progress) => {
        console.log('GIF Conversion Progress:', progress.frames);
      })
      .on('end', () => {
        console.log('GIF conversion complete!', inputPath);
        resolve('GIF conversion complete!');
      })
      .run();
  });
}
