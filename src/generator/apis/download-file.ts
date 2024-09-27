import fs from 'fs';
import axios from 'axios';

export async function downloadFile(url: string, outputPath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
      console.group();
      console.log(`Downloading ${url}: ${percentCompleted}%`);
      console.groupEnd();
    },
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
