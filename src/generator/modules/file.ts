import path from 'path';
import { isImage, isVideo } from '../utils';
import { downloadFile } from '../apis/download-file';
import { config } from '../config';

export function downloadAndPlaceAsset({
  assetUrl,
  ext,
  assetName,
  outAssetName,
  downloadPromises,
}: {
  assetUrl: string;
  ext?: string;
  assetName: string;
  outAssetName?: string;
  downloadPromises: Promise<unknown>[];
}) {
  let extensionFromAsset = path.extname(assetUrl).toLowerCase();
  extensionFromAsset = extensionFromAsset.startsWith('.') ? extensionFromAsset.slice(1) : extensionFromAsset;
  extensionFromAsset = isVideo(extensionFromAsset) ? config.videoOutputFormat : 'jpeg';
  const extension = ext ?? extensionFromAsset;
  const downloadPath = path.join(config.tempDownloadDir, `${outAssetName ?? assetName}.${extension}`);
  downloadPromises.push(downloadFile(assetUrl, downloadPath));
  return path.join('assets', `${outAssetName ?? assetName}.${extension}`);
}
