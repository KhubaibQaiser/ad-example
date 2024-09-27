import { getFeatureLookData } from '@/generator/apis/get-feature-look';
import { generateAd } from '@/generator/generateAd';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  const { templates, size, publisherHandles, storeHandles } = await request.json();

  const outputDir = path.join(process.cwd(), 'public', 'ads');

  try {
    let responses = [];
    for (const publisher of publisherHandles) {
      for (const storeHandle of storeHandles) {
        const data = await getFeatureLookData({ publisher, storeHandle });
        for (const template of templates) {
          const [width, height] = size.split('x').map(Number);
          const response = await generateAd(data, outputDir, template, width, height, publisher, storeHandle);
          responses.push(response);
        }
      }
    }
    return NextResponse.json({ data: responses, error: null });
  } catch (error) {
    console.error('Error generating ads:', error);
    return NextResponse.json({ data: null, error }, { status: 500 });
  }
}
