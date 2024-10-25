// app/api/curate-and-generate-banner/route.ts
import { FeatureLookCollectionAdDataType } from '@/generator/types';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { collection_id, ad_id, campaign_id, utms } = await request.json();

    const curatedResponse = await fetch(`${request.nextUrl.origin}/api/get-curated-banner-data-by-collection-id?collection_id=${collection_id}`);
    const curatedData: { data: FeatureLookCollectionAdDataType; error: string } = await curatedResponse.json();

    if (!curatedResponse.ok) {
      throw new Error(curatedData.error ?? 'Failed to fetch curated banner data');
    }

    // Call the second API route to generate the native banner ad using the curated data
    const generateResponse = await fetch(`${request.nextUrl.origin}/api/generate-native-banner-ad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: curatedData.data, tracking: { ad_id, campaign_id, utms } }),
    });

    if (!generateResponse.ok) {
      throw new Error('Failed to generate native banner ad');
    }

    // Stream the zip file as the response
    const stream = generateResponse.body;

    return new NextResponse(stream, {
      headers: {
        'Content-Disposition': `attachment; filename=${curatedData.data.collection_handle}.zip`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error?.message ?? 'Something went wrong' }, { status: 500 });
  }
}
