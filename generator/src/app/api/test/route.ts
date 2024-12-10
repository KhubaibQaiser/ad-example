import { PublisherStore } from '@/generator/types';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = await axios<PublisherStore>({
    method: 'GET',
    url: `https://tastemade.us-west-2.citadel.test.shopsense.ai/store/custom/store/superstore/super`,
  });

  return NextResponse.json({
    data: response.data,
    error: null,
  });
}
