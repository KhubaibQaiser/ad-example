import path from 'path';
import dotenv from 'dotenv';
// import yargs from 'yargs/yargs';
// import { hideBin } from 'yargs/helpers';

const isProduction = process.env.NODE_ENV === 'production';

// Parse command-line arguments
// export const argv = yargs(hideBin(process.argv))
//   .options({
//     width: {
//       alias: 'w',
//       type: 'number',
//       description: 'Width for the ad unit',
//       default: 160,
//     },
//     height: {
//       alias: 'h',
//       type: 'number',
//       description: 'Height for the ad unit',
//       default: 600,
//     },
//     quality: {
//       alias: 'q',
//       type: 'number',
//       description: 'Quality for image compression',
//       default: 80,
//     },
//     'compress-video': {
//       alias: 'cv',
//       type: 'boolean',
//       description: 'Enable or disable video compression',
//       default: false,
//     },
//     'store-handle': {
//       alias: 'sh',
//       type: 'string',
//       description: 'Comma separated list of store handles',
//       demandOption: true,
//     },
//     'collection-handle': {
//       alias: 'ch',
//       type: 'string',
//       description: 'Comma separated list of collection handles',
//       demandOption: true,
//     },
//     template: {
//       alias: 't',
//       type: 'string',
//       description: 'Comma separated list of templates to use. If no option is provided ad will be generated for all available templates.',
//     },
//   })
//   .parseSync();

const envFile = `.env.${isProduction ? 'production' : 'development'}`;
dotenv.config({ path: envFile });

const rootDir = path.join('/tmp', 'shopsense-embeds');
// const rootDir = process.cwd();

export const config = {
  isProduction,
  rootDir,
  imageCompressionQuality: 80,
  compressVideos: false,
  tempDownloadDir: path.join(rootDir, 'downloads'),
  outputRootDir: path.join(rootDir, 'output'),
  supportedTemplates: {
    'curated-products-template': 'curated-products-template',
    'carousel-template': 'carousel-template',
    'banner-template': 'banner-template',
  },
  videoOutputFormat: 'mp4', // '.avi', '.mov', '.mp4', '.m4v', '.mpeg', '.mpg', '.webm', '.wmv' or 'gif'
};
