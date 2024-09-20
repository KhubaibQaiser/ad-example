const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const axios = require('axios');
const config = require('./config').default;

async function fetchData() {
  if (config.API_BASE_URL) {
    console.log('Fetching data from store...');
    try {
      const response = await axios({
        method: 'get',
        url: `${config.API_BASE_URL}store/custom/store/superstore/super`,
      });

      const store = response.data.sub_stores.find((_s) => _s.handle === config.currentCollectionHandle);
      store.collections.forEach((collection) => {
        if (collection.moduleType === 'featureLook') {
          const data = {
            title: collection.title,
            image_url: collection.image_url,
            description: collection.description,
            moduleType: collection.moduleType,
            collection_handle: store.handle,
            moduleData: collection.metadata.moduleData,
            products: [],
          };
          console.log('Storing data to file...');
          const dataFilePath = path.join(__dirname, 'data', 'data.json');
          fsExtra.ensureFileSync(dataFilePath);
          fs.writeFileSync(dataFilePath, JSON.stringify(data));
          console.log('Data stored to file successfully!');
          return;
        }
      });
    } catch (error) {
      console.error('Error fetching data from store:', error);
      throw new Error('Error fetching data from store');
    }
  } else {
    console.error('STORE_URL not found in .env file');
    throw new Error('STORE_URL not found in .env file');
  }
}

// Function to download and save files
async function downloadFile(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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

module.exports = {
  fetchData,
  downloadFile,
};
