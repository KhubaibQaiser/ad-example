import path from 'path';

const isProduction = false;

const rootDir = path.join('/tmp', 'shopsense-embeds');

export const generatorConfig = {
    isProduction,
    rootDir,
    templatesDir: path.join(process.cwd(), 'generate-embed'),
    imageCompressionQuality: 80,
    compressVideos: !isProduction,
    tempDownloadDir: path.join(rootDir, 'downloads'),
    outputRootDir: path.join(rootDir, 'output'),
    supportedTemplates: {
        // CarouselTemplate: 'carousel-template',
        // CuratedProductsTemplate: 'curated-products-template',
        // BannerTemplate: 'banner-template',
        CbsSportsVerticalTemplate: 'cbs-sports-vertical',
    },
    sizes: {
        Skyscraper: '160x600',
        BannerTemplate: '912x384',
    },
    videoOutputFormat: 'mp4',
};

export type SupportedTemplates = keyof typeof generatorConfig.supportedTemplates;
