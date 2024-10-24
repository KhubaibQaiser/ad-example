import path from 'path';
import fsExtra from 'fs-extra';
import { isVideo } from '@/generator/utils/generator-utils';
import { downloadFile } from '../apis/download-file';
import { config } from '../config';
import { FeatureLookCollectionAdDataType } from '../types';

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
  extensionFromAsset = isVideo(extensionFromAsset) ? config.videoOutputFormat : 'jpeg';
  const extension = ext ?? extensionFromAsset;
  await fsExtra.ensureDir(path.join(config.tempDownloadDir, dirName));
  const downloadPath = path.join(config.tempDownloadDir, dirName, `${outAssetName ?? assetName}.${extension}`);
  downloadPromises.push(downloadFile(assetUrl, downloadPath));
  return path.join('', 'assets', `${outAssetName ?? assetName}.${extension}`);
}

export async function downloadAssetsAndParseReferences(flDataArr: FeatureLookCollectionAdDataType[]): Promise<FeatureLookCollectionAdDataType[]> {
  const downloadPromises: Promise<unknown>[] = [];
  const modifiedData = JSON.parse(JSON.stringify(flDataArr));

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
    for (let i = 0; i < data.moduleData.length; i++) {
      const moduleData = data.moduleData[i];

      if (moduleData.srcURL) {
        moduleData.srcURL = await downloadAndPlaceAsset({
          assetUrl: moduleData.srcURL,
          assetName: `asset_${moduleData.media}_${i}`,
          dirName: data.collection_handle,
          downloadPromises,
        });
      }

      if (moduleData.backdropUrl) {
        moduleData.backdropUrl = downloadAndPlaceAsset({
          assetUrl: moduleData.backdropUrl,
          assetName: `backdrop_${i}`,
          dirName: data.collection_handle,
          downloadPromises,
        });
      }

      for (let j = 0; j < moduleData.products.length; j++) {
        const product = moduleData.products[j];
        product.handle = product.url ? product.url : `${data.product_base_url}${product.handle ? product.handle : ''}`;

        if (product.image) {
          product.image = await downloadAndPlaceAsset({
            assetUrl: product.image,
            assetName: `product_${i}_${j}`,
            outAssetName: `product_${i}_${j}`,
            dirName: data.collection_handle,
            downloadPromises,
          });
        }

        // TODO: Need to fix the 'retailer' object and then switch 'retailer_data' with 'retailer'
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
  console.log('Downloaded SHARED assets successfully!');
  return modifiedData;
}

export async function copyFolderRecursive(srcPath: string, destPath: string) {
  await fsExtra.ensureDir(destPath);
  await fsExtra.copy(srcPath, destPath, { overwrite: true });
  console.log('Copied assets successfully!');
}
