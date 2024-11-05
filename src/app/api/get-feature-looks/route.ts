import { getFeatureLookData } from '@/generator/apis/get-feature-look';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { publisher } = await request.json();

  try {
    const data = await getFeatureLookData({ publisher });
    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ data: null, error }, { status: 500 });
  }
}
