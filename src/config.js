const path = require('path');
const dotenv = require('dotenv');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const isProduction = process.env.NODE_ENV === 'production';

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
  .option('width', {
    alias: 'w',
    type: 'number',
    description: 'Width for the ad unit',
    default: 160,
  })
  .option('height', {
    alias: 'h',
    type: 'number',
    description: 'Height for the ad unit',
    default: 600,
  })
  .option('quality', {
    alias: 'q',
    type: 'number',
    description: 'Quality for image compression',
    default: 80,
  })
  .option('compress-video', {
    alias: 'cv',
    type: 'boolean',
    description: 'Enable or disable video compression',
    default: false,
  })
  .option('store-handle', {
    alias: 'sh',
    type: 'string',
    description: 'Store handle',
    default: 'tastemade',
  })
  .option('collection-handle', {
    alias: 'ch',
    type: 'string',
    description: 'Store Collection handle',
    default: 'auimg',
  })
  .option('template', {
    alias: 't',
    type: 'string',
    description: 'Ad template to use',
  }).argv;

const envFile = `.env.${isProduction ? 'production' : 'development'}`;
const storeHandleEnvFile = `.env.${argv['store-handle']}${isProduction ? '' : '.test'}`;
dotenv.config({ path: envFile });
dotenv.config({ path: storeHandleEnvFile });

const config = {
  isProduction,
  API_BASE_URL: process.env.STORE_URL,
  outputRootDir: 'ads',
  width: argv.width,
  height: argv.height,
  quality: argv.quality,
  compressVideos: argv['compress-video'],
  currentStore: argv['store-handle'],
  currentCollectionHandle: argv['collection-handle'],
  tempDownloadDir: path.join(__dirname, 'temp'),
};

module.exports = {
  config,
  argv,
};
