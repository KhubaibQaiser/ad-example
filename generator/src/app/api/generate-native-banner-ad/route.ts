import { config } from '@/generator/config';
import { generateAd } from '@/generator/generateAd';
import fsExtra from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { FeatureLookCollectionAdDataType, TrackingPayloadType, FLMeta } from '@/generator/types';
import { zipDirectory } from '@/generator/utils/file';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const {
    data: _data,
    tracking,
    width: w,
    height: h,
    template,
    meta,
  }: {
    data: FeatureLookCollectionAdDataType;
    tracking: TrackingPayloadType;
    width?: number;
    height?: number;
    template?: keyof typeof config.supportedTemplates;
    meta?: FLMeta;
  } = await request.json();

  try {
    const data = [_data];
    const [width, height] = typeof w === 'number' && typeof h === 'number' ? [w, h] : config.sizes.BannerTemplate.split('x').map(Number);
    const _template = template ?? 'BannerTemplate';
    await generateAd(data, _template, width, height, tracking, meta);

    const outputRootDir = path.join(config.outputRootDir, data[0].collection_handle, config.supportedTemplates[_template]);
    console.log('Create Zip file at:', outputRootDir);
    await fsExtra.ensureDir(outputRootDir);
    // Assuming the generateAd function already saves files in the outputRootDir
    const zipFilePath = path.join(outputRootDir, '..', `${data[0].collection_handle}.zip`);
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
        'Content-Disposition': `attachment; filename=${data[0].collection_handle}.zip`,
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
