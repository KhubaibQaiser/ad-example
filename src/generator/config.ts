import path from 'path';
import dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

const envFile = `.env.${isProduction ? 'production' : 'development'}`;
dotenv.config({ path: envFile });

const rootDir = path.join('/tmp', 'shopsense-embeds');

export const config = {
  isProduction,
  rootDir,
  imageCompressionQuality: 80,
  compressVideos: !isProduction,
  tempDownloadDir: path.join(rootDir, 'downloads'),
  outputRootDir: path.join(rootDir, 'output'),
  supportedTemplates: {
    CuratedProductsTemplate: 'curated-products-template',
    CarouselTemplate: 'carousel-template',
    BannerTemplate: 'banner-template',
    CBSVerticalTemplate: 'cbs-template-vertical',
  },
  sizes: {
    Skyscraper: '160x600',
    SkyscraperWide: '300x600',
    BannerTemplate: '912x384',
  },
  videoOutputFormat: 'mp4', // '.avi', '.mov', '.mp4', '.m4v', '.mpeg', '.mpg', '.webm', '.wmv' or 'gif'
};
