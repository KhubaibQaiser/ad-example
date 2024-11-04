import { getFeatureLookData } from '@/generator/apis/get-feature-look';
import { config } from '@/generator/config';
import { generateAd } from '@/generator/generateAd';
import { downloadAssetsAndParseReferences } from '@/generator/modules/file';
import { AdGenerationResponse } from '@/types';
import fsExtra from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { zipDirectory } from '@/generator/utils/file';
import { FLMeta } from '@/generator/types';

export const maxDuration = 60;

async function clearOutputDir() {
  console.log('Clearing output directory...');
  await fsExtra.emptyDir(config.outputRootDir);
}

async function generateAds(
  templates: (keyof typeof config.supportedTemplates)[],
  size: string,
  publisherHandles: string[],
  storeHandles: string[],
  meta: FLMeta
): Promise<AdGenerationResponse[]> {
  await clearOutputDir();
  const responses: AdGenerationResponse[][] = [];
  for (const publisher of publisherHandles) {
    for (const storeHandle of storeHandles) {
      const data = await getFeatureLookData({ publisher, storeHandle });
      if (data) {
        const localReferenceData = await downloadAssetsAndParseReferences(data);
        for (const template of templates) {
          const [width, height] = size.split('x').map(Number);
          const response = await generateAd(localReferenceData, template, width, height, undefined, meta);
          responses.push(response);
        }
      }
    }
  }
  return responses.flat();
}

export async function POST(request: NextRequest) {
  const { templates, size, publisherHandles, storeHandles, meta } = await request.json();

  try {
    await generateAds(templates, size, publisherHandles, storeHandles, meta);

    const outputRootDir = config.outputRootDir;
    if (!fs.existsSync(outputRootDir)) {
      throw new Error('Output root directory does not exist.');
    }

    // Assuming the generateAd function already saves files in the outputRootDir

    const zipFilePath = path.join(outputRootDir, '..', 'embeds.zip');
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
        'Content-Disposition': 'attachment; filename=embeds.zip',
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
