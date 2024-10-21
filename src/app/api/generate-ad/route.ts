import { getFeatureLookData } from '@/generator/apis/get-feature-look';
import { config } from '@/generator/config';
import { generateAd } from '@/generator/generateAd';
import { downloadDataToTemp } from '@/generator/modules/file';
import fsExtra from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { templates, size, publisherHandles, storeHandles, meta } = await request.json();

  try {
    const responses: unknown[] = [];
    for (const publisher of publisherHandles) {
      for (const storeHandle of storeHandles) {
        const data = await getFeatureLookData({ publisher, storeHandle, meta });
        if (data) {
          const localReferenceData = await downloadDataToTemp(data);
          // TODO: Compress and place assets in the compressed_assets directory
          for (const template of templates) {
            const [width, height] = size.split('x').map(Number);
            const response = await generateAd(localReferenceData, template, width, height);
            responses.push(response);
          }
        }
      }
    }
    return NextResponse.json({ data: responses, error: null });
  } catch (error) {
    console.error('Error generating ads:', error);
    return NextResponse.json({ data: null, error }, { status: 500 });
  } finally {
    console.log('Removing temporary download directory...');
    await fsExtra.remove(config.tempDownloadDir);
  }
}
