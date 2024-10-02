import fs from 'fs';

import ffmpeg from 'fluent-ffmpeg';
// if (process.env.NODE_ENV === 'production') {
//   // Path to the local FFmpeg binary
//   const ffmpegPath = path.join(__dirname, 'lib', 'ffmpeg');
//   // Set the path to the FFmpeg binary
//   ffmpeg.setFfmpegPath(ffmpegPath);
// }

export function processVideoAsset(inputPath: string, outputPath: string, width: number, compressVideos = true) {
  if (!compressVideos) {
    // !Important: Video compression is not supported on servers without FFmpeg installed
    console.warn('Skipping video compression...');
    fs.copyFileSync(inputPath, outputPath);
    return;
  }
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
