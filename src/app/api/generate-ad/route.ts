import { getFeatureLookData } from '@/generator/apis/get-feature-look';
import { config } from '@/generator/config';
import { generateAd } from '@/generator/generateAd';
import { downloadDataToTemp } from '@/generator/modules/file';
import { AdGenerationResponse } from '@/types';
import fsExtra from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

export const maxDuration = 60;

async function clearOutputDir() {
  console.log('Clearing output directory...');
  await fsExtra.emptyDir(config.outputRootDir);
}

async function generateAds(
  templates: string[],
  size: string,
  publisherHandles: string[],
  storeHandles: string[],
  meta: any
): Promise<AdGenerationResponse[]> {
  await clearOutputDir();
  const responses: AdGenerationResponse[][] = [];
  for (const publisher of publisherHandles) {
    for (const storeHandle of storeHandles) {
      const data = await getFeatureLookData({ publisher, storeHandle, meta });
      if (data) {
        const localReferenceData = await downloadDataToTemp(data);
        for (const template of templates) {
          const [width, height] = size.split('x').map(Number);
          const response = await generateAd(localReferenceData, template, width, height);
          responses.push(response);
        }
      }
    }
  }
  return responses.flat();
}

async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  console.log('Zipping output...');
  const output = fs.createWriteStream(outPath);
  console.log('Created output stream');
  const archive = archiver('zip', { zlib: { level: 5 } });
  console.log('Created archive');

  return new Promise((resolve, reject) => {
    output.on('finish', () => {
      console.log('Archive closed');
      resolve();
    });
    archive.on('error', (err) => {
      console.error('Error while archiving:', err);
      reject(err);
    });
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        console.error('Archive warning:', err);
        throw err;
      }
    });
    archive.pipe(output);
    console.log('Piped archive to output stream');
    archive.directory(sourceDir, false);
    console.log('Added directory to archive');
    archive.finalize();
    console.log('Finalized archive');
  });
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
