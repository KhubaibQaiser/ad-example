import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

import {
    EmbedGeneratorPayload,
    TemplateGeneratorHandler,
    TemplateGeneratorResponse,
    TrackingPayloadType,
} from '../shared/types';

// import generateCarousel from './templates/carousel-template/generate';
// import generateCuratedProduct from './templates/curated-products-template/generate';
// import generateBanner from './templates/banner-template/generate';
import { getSlug, minifyHtml, renderTemplate } from './utils/generator.utils';
import generateCbsSportsVertical from './templates/cbs-template-vertical/generate';
import { generatorConfig, SupportedTemplates } from './config';
import { copyGlobalFiles, downloadAssetsAndParseReferences } from './helpers/file';
import { formatPrice, getDiscountPercentage, showDiscount } from '../shared/utils';

const TEMPLATE_GENERATOR_MAP: Record<SupportedTemplates, TemplateGeneratorHandler> = {
    // CarouselTemplate: generateCarousel,
    // CuratedProductsTemplate: generateCuratedProduct,
    // BannerTemplate: generateBanner,
    CbsSportsVerticalTemplate: generateCbsSportsVertical,
};

export async function generateEmbed(
    _data: EmbedGeneratorPayload[],
    template: SupportedTemplates,
    width: number,
    height: number,
    tracking?: TrackingPayloadType,
) {
    let outputAdRootDir = '';

    const templatesDir = path.join(generatorConfig.templatesDir, 'templates');
    const templateDirName = generatorConfig.supportedTemplates[template];
    const templateDir = path.join(templatesDir, templateDirName);

    const data = await downloadAssetsAndParseReferences(_data);

    await fsExtra.ensureDir(generatorConfig.tempDownloadDir);
    await fsExtra.ensureDir(generatorConfig.outputRootDir);
    const adsPromises: Promise<TemplateGeneratorResponse>[] = [];
    data.forEach((data) => {
        adsPromises.push(
            new Promise(async (resolve, reject) => {
                try {
                    const slug = data.collection_handle ?? getSlug(data.title);
                    outputAdRootDir = path.join(generatorConfig.outputRootDir, slug);
                    if (fs.existsSync(outputAdRootDir)) {
                        await fsExtra.remove(outputAdRootDir);
                    }
                    await fsExtra.ensureDir(outputAdRootDir);
                    const outputAdDir = path.join(outputAdRootDir, 'ad');
                    await fsExtra.ensureDir(outputAdDir);
                    const generateAd = TEMPLATE_GENERATOR_MAP[template];
                    await generateAd({
                        data,
                        outputAdDir,
                        templateDir,
                        width,
                        utils: { formatPrice, showDiscount, getDiscountPercentage },
                    });
                    await copyGlobalFiles(outputAdDir, tracking);
                    const adHtml = renderTemplate(path.join(templatesDir, 'ad.html'), {
                        title: data.title,
                        width,
                        height,
                    });
                    const minifiedAdHtml = await minifyHtml(adHtml);
                    const adIndexPath = path.join(outputAdRootDir, 'index.html');
                    fs.writeFileSync(adIndexPath, minifiedAdHtml);
                    const responseMessage = `Ad has been generated successfully!`;
                    const relativePath = path.relative(process.cwd(), adIndexPath).replace('public/', '');
                    resolve({
                        message: responseMessage,
                        slug,
                        template,
                        outputPath: relativePath,
                    } as TemplateGeneratorResponse);
                } catch (error) {
                    console.error('Error generating ad:', error);
                    reject({ message: `Error generating ad: ${template}`, error });
                }
            }),
        );
    });

    const adsGenerationResponse = await Promise.all(adsPromises);
    return adsGenerationResponse;
}
