const fs = require('fs');
const axios = require('axios');
const { config } = require('./config');

async function fetchData() {
  if (config.API_BASE_URL) {
    console.log('Fetching data from store...');
    try {
      const response = await axios({
        method: 'get',
        url: `${config.API_BASE_URL}store/custom/store/superstore/super`,
      });
      let data = null;

      const store = response.data.sub_stores.find((_s) => _s.handle === config.currentCollectionHandle);
      store.collections.forEach((collection) => {
        if (collection.moduleType === 'featureLook') {
          data = {
            title: collection.title,
            image_url: collection.image_url,
            description: collection.description,
            moduleType: collection.moduleType,
            collection_handle: store.handle,
            moduleData: collection.metadata.moduleData,
            products: [],
          };
          return;
        }
      });

      return data;
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
