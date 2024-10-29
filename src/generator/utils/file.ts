import archiver from 'archiver';
import fs from 'fs';

export async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  console.log('Zipping output...');
  const output = fs.createWriteStream(outPath);
  console.log('Created output stream');
  const archive = archiver('zip', { zlib: { level: 5 } });
  console.log('Created archive');

  return new Promise((resolve, reject) => {
    output.on('finish', () => {
      console.log('Archive closed');
      resolve();
    });
    archive.on('error', (err) => {
      console.error('Error while archiving:', err);
      reject(err);
    });
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        console.error('Archive warning:', err);
        throw err;
      }
    });
    archive.pipe(output);
    console.log('Piped archive to output stream');
    archive.directory(sourceDir, false);
    console.log('Added directory to archive');
    archive.finalize();
    console.log('Finalized archive');
  });
}
