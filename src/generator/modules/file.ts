import path from 'path';
import fsExtra from 'fs-extra';
import { isVideo } from '@/generator/utils/generator-utils';
import { downloadFile } from '../apis/download-file';
import { config } from '../config';

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
  return path.join(dirName, 'assets', `${outAssetName ?? assetName}.${extension}`);
}
