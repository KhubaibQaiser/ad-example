import { config } from '@/generator/config';
import { generateAd } from '@/generator/generateAd';
import { downloadAssetsAndParseReferences } from '@/generator/modules/file';
import fsExtra from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { FeatureLookCollectionAdDataType } from '@/generator/types';
import { zipDirectory } from '@/generator/utils/file';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { data }: { data: FeatureLookCollectionAdDataType } = await request.json();

  console.log('RECEIVED DATA FOR NATIVE BANNER AD', data);
  try {
    // await clearOutputDir();
    const localReferenceData = await downloadAssetsAndParseReferences([data]);

    const [width, height] = config.sizes.BannerTemplate.split('x').map(Number);
    await generateAd(localReferenceData, 'BannerTemplate', width, height);

    const outputRootDir = path.join(config.outputRootDir, localReferenceData[0].collection_handle, 'banner-template');
    console.log('Create Zip file at:', outputRootDir);
    await fsExtra.ensureDir(outputRootDir);
    // Assuming the generateAd function already saves files in the outputRootDir
    const zipFilePath = path.join(outputRootDir, '..', `${localReferenceData[0].collection_handle}.zip`);
    // await fsExtra.ensureDir(zipFilePath);
    await zipDirectory(outputRootDir, zipFilePath);
    console.log('Zip file created:', zipFilePath);

    // Stream the zip file as the response using a ReadableStream
    const fileStream = fs.createReadStream(zipFilePath);
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Disposition': `attachment; filename=${localReferenceData[0].collection_handle}.zip`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (error) {
    console.error('Error generating ads:', error);
    return NextResponse.json({ data: null, error }, { status: 500 });
  } finally {
    console.log('Removing temporary download directory...');
    await fsExtra.remove(config.tempDownloadDir);
  }
}
