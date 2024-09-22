const ffmpeg = require('fluent-ffmpeg');
// if (process.env.NODE_ENV === 'production') {
//   // Path to the local FFmpeg binary
//   const ffmpegPath = path.join(__dirname, 'lib', 'ffmpeg');
//   // Set the path to the FFmpeg binary
//   ffmpeg.setFfmpegPath(ffmpegPath);
// }

function processVideoAsset(inputPath, outputPath, width, compressVideos = true) {
  if (!compressVideos) {
    // !Important: Video compression is not supported on servers without FFmpeg installed
    console.warn('Skipping video compression...');
    fs.copyFileSync(inputPath, outputPath);
    return;
  }
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .noAudio()
      .size(`${width}x?`) // Resize to the specified width, maintaining aspect ratio
      .videoBitrate('1000k') // Set video bitrate
      .outputOptions('-crf 30') // Set constant rate factor for quality
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

module.exports = { processVideoAsset };
