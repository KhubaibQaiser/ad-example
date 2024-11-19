import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import { isImage, isVideo } from '../../shared/utils';
import { generatorConfig } from '../config';
import { downloadFile } from './download-file';
import { EmbedGeneratorPayload, TrackingPayloadType } from '../../shared/types';
import { compressImageAsset } from './compression/image.compression';
import { minifyHtml } from '../utils/generator.utils';
import { minifyCss } from '../utils/generator.utils';
import { minifyJs } from '../utils/generator.utils';

export async function downloadAndPlaceAsset({
    assetUrl,
    ext,
    assetName,
    outAssetName,
    dirName,
    downloadPromises,
}: {
    assetUrl: string;
    ext?: string;
    assetName: string;
    dirName: string;
    outAssetName?: string;
    downloadPromises: Promise<unknown>[];
}) {
    let extensionFromAsset = path.extname(assetUrl).toLowerCase();
    extensionFromAsset = extensionFromAsset.startsWith('.') ? extensionFromAsset.slice(1) : extensionFromAsset;
    if (isVideo(extensionFromAsset)) {
        extensionFromAsset = generatorConfig.videoOutputFormat;
    }
    const extension = ext ?? extensionFromAsset;
    await fsExtra.ensureDir(path.join(generatorConfig.tempDownloadDir, dirName));
    const downloadPath = path.join(
        generatorConfig.tempDownloadDir,
        dirName,
        `${outAssetName ?? assetName}.${extension}`,
    );
    downloadPromises.push(downloadFile(assetUrl, downloadPath));
    return path.join('', 'assets', `${outAssetName ?? assetName}.${extension}`);
}

export async function downloadAssetsAndParseReferences(
    data: EmbedGeneratorPayload[],
): Promise<EmbedGeneratorPayload[]> {
    const downloadPromises: Promise<unknown>[] = [];
    const modifiedData: EmbedGeneratorPayload[] = JSON.parse(JSON.stringify(data));

    console.log('Downloading assets...', modifiedData);
    for (let fl = 0; fl < modifiedData.length; fl++) {
        const data = modifiedData[fl];
        // Download and process image_url
        if (data.image_url) {
            data.image_url = await downloadAndPlaceAsset({
                assetUrl: data.image_url,
                assetName: 'main_image',
                dirName: data.collection_handle,
                downloadPromises,
            });
        }

        // Download and process moduleData assets
        for (let i = 0; i < data.modules.length; i++) {
            const moduleData = data.modules[i];

            if (moduleData.srcURL) {
                moduleData.srcURL = await downloadAndPlaceAsset({
                    assetUrl: moduleData.srcURL,
                    assetName: `asset_${moduleData.media}_${i}`,
                    dirName: data.collection_handle,
                    downloadPromises,
                });
            }

            for (let j = 0; j < moduleData.products.length; j++) {
                const product = moduleData.products[j];
                product.product_url = generatorConfig.isProduction ? product.affiliate_url : product.product_url;

                if (product.thumbnail_url) {
                    product.thumbnail_url = await downloadAndPlaceAsset({
                        assetUrl: product.thumbnail_url,
                        assetName: `product_${i}_${j}`,
                        outAssetName: `product_${i}_${j}`,
                        dirName: data.collection_handle,
                        downloadPromises,
                    });
                }

                const retailerData = product.retailer;
                if (retailerData && retailerData.thumbnail_url) {
                    retailerData.thumbnail_url = await downloadAndPlaceAsset({
                        assetUrl: retailerData.thumbnail_url,
                        assetName: `retailer_thumbnail_${i}_${j}`,
                        outAssetName: `retailer_thumbnail_${i}_${j}`,
                        dirName: data.collection_handle,
                        downloadPromises,
                    });
                }
            }
        }
    }

    await Promise.all(downloadPromises);
    console.log('Downloaded assets successfully!');
    return modifiedData;
}

export async function copyFolderRecursive(srcPath: string, destPath: string) {
    await fsExtra.ensureDir(destPath);
    await fsExtra.copy(srcPath, destPath, { overwrite: true });
    console.log('Copied assets successfully!');
}

export async function compressAssets(inputDir: string, outputDir: string, _width: number, excludeVideo = false) {
    const width = parseInt(`${_width}`);
    const quality = parseInt(`${generatorConfig.imageCompressionQuality}`);

    const entries = fs.readdirSync(inputDir, { withFileTypes: true });

    for (const entry of entries) {
        const inputPath = path.join(inputDir, entry.name);
        const outputPath = path.join(outputDir, entry.name);

        if (entry.isDirectory()) {
            await fsExtra.ensureDir(outputPath);
            await compressAssets(inputDir, outputPath, width, excludeVideo);
        } else if (entry.name.startsWith('.')) {
            // Ignore
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            let w: string | number = width;
            if (inputPath.includes('_w_')) {
                w = inputPath.split('_w_')[1].split('.')[0];
                w = isNaN(parseInt(w)) ? width : parseInt(w);
            }
            if (isImage(ext)) {
                await compressImageAsset(inputPath, outputPath, w, ext, quality);
            } else if (!excludeVideo) {
                // await compressVideoAsset(inputPath, outputPath, w, config.compressVideos, config.videoOutputFormat);
            }
        }
    }
    console.log('Assets compressed successfully!');
}

export async function copyGlobalFiles(outputDir: string, tracking?: TrackingPayloadType): Promise<void> {
    const globalDir = path.join(generatorConfig.templatesDir, 'global');
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
            minifiedContent = minifiedContent.replace('{{AMPLITUDE_API_KEY}}', process.env.AMPLITUDE_API_KEY || '');
            minifiedContent = minifiedContent.replace(
                '{{ENV_PLACEHOLDER}}',
                process.env.ENV === 'production' ? 'production' : 'development',
            );

            if (tracking) {
                minifiedContent = minifiedContent.replace('{{EMBED_ID_PLACEHOLDER}}', tracking.embed_id || '');
                minifiedContent = minifiedContent.replace('{{CAMPAIGN_ID_PLACEHOLDER}}', tracking.campaign_id || '');
                if (tracking.utms) {
                    const utmKeys = Object.keys(tracking.utms) as (keyof typeof tracking.utms)[];
                    utmKeys.forEach((key) => {
                        minifiedContent = minifiedContent.replace(
                            `{{${key.toUpperCase()}_PLACEHOLDER}}`,
                            tracking.utms[key] || '',
                        );
                    });
                }
            }
        }
        fs.writeFileSync(outputFilePath, minifiedContent);
    }
}
