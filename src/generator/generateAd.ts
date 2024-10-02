import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { config } from './config';
import { getSlug, minifyCss, minifyHtml, minifyJs, renderTemplate } from './utils';
import { generate as generateCarousel } from './templates/carousel-template/generate';
import { generate as generatedCuratedProduct } from './templates/curated-products-template/generate';
import { AdGenerationResponse } from '@/types';
import { FeatureLookCollectionAdDataType } from './types';

const TEMPLATE_GENERATOR_MAP = {
  [config.supportedTemplates['carousel-template']]: generateCarousel,
  [config.supportedTemplates['curated-products-template']]: generatedCuratedProduct,
};

const { tempDownloadDir } = config;

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

export async function generateAd(flData: FeatureLookCollectionAdDataType[], outputRootDir: string, template: string, width: number, height: number) {
  let outputAdRootDir = '';
  try {
    const templatesDir = path.join(process.cwd(), 'src', 'generator', 'templates');
    const templateDir = path.join(templatesDir, template);
    await fsExtra.ensureDir(tempDownloadDir);
    await fsExtra.ensureDir(outputRootDir);
    // writeDataToTemp(flData, tempDownloadDir);
    const adsPromises: Promise<unknown>[] = [];
    flData.forEach((data) => {
      adsPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const slug = data.collection_handle ?? getSlug(data.title);
            outputAdRootDir = path.join(outputRootDir, slug, template);
            if (fs.existsSync(outputAdRootDir)) {
              await fsExtra.remove(outputAdRootDir);
            }
            await fsExtra.ensureDir(outputAdRootDir);
            const outputAdDir = path.join(outputAdRootDir, 'ad');
            await fsExtra.ensureDir(outputAdDir);
            const generate = TEMPLATE_GENERATOR_MAP[template as keyof typeof TEMPLATE_GENERATOR_MAP];
            await generate(data, outputAdDir, templateDir, width, config.compressionQuality);
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
            reject(`Error generating ad: ${template}`);
          }
        })
      );
    });

    const adsGenerationResponse = await Promise.all(adsPromises);
    return adsGenerationResponse;
  } finally {
    console.log('Removing temporary download directory...');
    await fsExtra.remove(tempDownloadDir);
  }
}
