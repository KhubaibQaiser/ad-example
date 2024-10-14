import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { config } from './config';
import { getSlug, minifyCss, minifyHtml, minifyJs, renderTemplate } from '@/generator/utils/generator-utils';
import { generate as generateCarousel } from './templates/carousel-template/generate';
import { generate as generatedCuratedProduct } from './templates/curated-products-template/generate';
import { AdGenerationResponse } from '@/types';
import { FeatureLookCollectionAdDataType } from './types';
import { downloadAndPlaceAsset } from './modules/file';

const TEMPLATE_GENERATOR_MAP = {
  [config.supportedTemplates['carousel-template']]: generateCarousel,
  [config.supportedTemplates['curated-products-template']]: generatedCuratedProduct,
};

async function copyGlobalFiles(outputDir: string): Promise<void> {
  const globalDir = path.join(process.cwd(), 'src', 'generator', 'global');
  await fsExtra.ensureDir(globalDir);
  const files = fs.readdirSync(globalDir);
  for (const file of files) {
    const filePath = path.join(globalDir, file);
    const outputFilePath = path.join(outputDir, file);

    let minifiedContent = '';

    const ext = path.extname(file).toLowerCase();
    switch (ext) {
      case '.js':
        minifiedContent = await minifyJs(filePath);
        break;
      case '.css':
        minifiedContent = await minifyCss(filePath);
        break;
      case '.html':
        minifiedContent = await minifyHtml(fs.readFileSync(filePath, 'utf-8'));
        break;
    }

    if (file === 'amplitude-wrapper.min.js') {
      minifiedContent = minifiedContent.replace('AMPLITUDE_API_KEY', process.env.AMPLITUDE_API_KEY || '');
      minifiedContent = minifiedContent.replace('ENV_PLACEHOLDER', process.env.ENVIRONMENT || 'development');
    }
    fs.writeFileSync(outputFilePath, minifiedContent);
  }
}

async function writeDataToTemp(data: FeatureLookCollectionAdDataType[], outputDir: string) {
  try {
    const dataFilePath = path.join(outputDir, 'data.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data to temp:', error);
  }
}

async function downloadDataToTemp(flDataArr: FeatureLookCollectionAdDataType[]) {
  const downloadPromises: Promise<unknown>[] = [];

  console.log('Downloading SHARED assets...', flDataArr);
  for (let fl = 0; fl < flDataArr.length; fl++) {
    const data = flDataArr[fl];
    // Download and process image_url
    if (data.image_url) {
      data.image_url = downloadAndPlaceAsset({
        assetUrl: data.image_url,
        assetName: 'main_image',
        dirName: data.collection_handle,
        downloadPromises,
      });
    }

    // Download and process moduleData assets
    for (let i = 0; i < data.moduleData.length; i++) {
      const moduleData = data.moduleData[i];

      if (moduleData.srcURL) {
        moduleData.srcURL = downloadAndPlaceAsset({
          assetUrl: moduleData.srcURL,
          assetName: `asset_${moduleData.media}_${i}`,
          dirName: data.collection_handle,
          downloadPromises,
        });
      }

      // if (moduleData.backdropUrl) {
      //   moduleData.backdropUrl = downloadAndPlaceAsset({
      //     assetUrl: moduleData.backdropUrl,
      //     assetName: `backdrop_${i}`,
      //     downloadPromises,
      //   });
      // }

      for (let j = 0; j < moduleData.products.length; j++) {
        const product = moduleData.products[j];

        if (product.image) {
          product.image = downloadAndPlaceAsset({
            assetUrl: product.image,
            assetName: `product_${i}_${j}`,
            outAssetName: `product_${i}_${j}`,
            dirName: data.collection_handle,
            downloadPromises,
          });

          product.handle = `${data.product_base_url}${product.handle}`;
        }
      }
    }
  }

  console.log('ALMOST Downloaded SHARED');
  await Promise.all(downloadPromises);
  console.log('Downloaded SHARED assets successfully!');
}

export async function generateAd(flData: FeatureLookCollectionAdDataType[], template: string, width: number, height: number) {
  let outputAdRootDir = '';
  try {
    const templatesDir = path.join(process.cwd(), 'src', 'generator', 'templates');
    const templateDir = path.join(templatesDir, template);
    await fsExtra.ensureDir(config.tempDownloadDir);
    await fsExtra.ensureDir(config.outputRootDir);
    // writeDataToTemp(flData, tempDownloadDir);
    await downloadDataToTemp(flData);
    return;
    const adsPromises: Promise<unknown>[] = [];
    flData.forEach((data) => {
      adsPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const slug = data.collection_handle ?? getSlug(data.title);
            outputAdRootDir = path.join(config.outputRootDir, slug, template);
            if (fs.existsSync(outputAdRootDir)) {
              await fsExtra.remove(outputAdRootDir);
            }
            await fsExtra.ensureDir(outputAdRootDir);
            const outputAdDir = path.join(outputAdRootDir, 'ad');
            await fsExtra.ensureDir(outputAdDir);
            const generateAd = TEMPLATE_GENERATOR_MAP[template as keyof typeof TEMPLATE_GENERATOR_MAP];
            await generateAd(data, outputAdDir, templateDir, width, config.imageCompressionQuality);
            await copyGlobalFiles(outputAdDir);
            const adHtml = renderTemplate(path.join(templatesDir, 'ad.html'), { title: data.title, width, height });
            const minifiedAdHtml = await minifyHtml(adHtml);
            const adIndexPath = path.join(outputAdRootDir, 'index.html');
            fs.writeFileSync(adIndexPath, minifiedAdHtml);
            const responseMessage = `Ad has been generated successfully!`;
            const relativePath = path.relative(process.cwd(), adIndexPath).replace('public/', '');
            resolve({ message: responseMessage, slug, template, outputPath: relativePath } as AdGenerationResponse);
          } catch (error) {
            console.error('Error generating ad:', error);
            reject({ message: `Error generating ad: ${template}`, error });
          }
        })
      );
    });

    const adsGenerationResponse = await Promise.all(adsPromises);
    return adsGenerationResponse;
  } finally {
    console.log('Removing temporary download directory...');
    // await fsExtra.remove(config.tempDownloadDir);
  }
}
