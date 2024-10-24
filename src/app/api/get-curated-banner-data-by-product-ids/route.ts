import { FeatureLookCollectionAdDataType } from '@/generator/types';
import { parseCollectionToGeneratorData } from '@/generator/utils/data-parser-utils';
import { supabase } from '@/services';
import { Product, Retailer } from '@/services/_types';
import { NextRequest, NextResponse } from 'next/server';

function getLogoThumbnailUrl(logos: Retailer['logos']) {
  const darkTheme = logos.find((logo) => {
    return logo.theme === 'dark';
  });

  if (darkTheme) {
    return darkTheme.formats[0].src;
  }

  return logos[0].formats[0].src;
}

export async function GET(req: NextRequest) {
  try {
    // Get the product ID from the request query parameters
    const { searchParams } = new URL(req.url);
    const productIds = searchParams.get('productIds'); // comma separated
    const title = searchParams.get('title');
    const limit = searchParams.get('limit');

    if (!productIds) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('product')
      .select(
        `
        id,
        display_name,
        base_price,
        sale_price,
        thumbnail_url,
        handle,
        product_url,
        affiliate_url,
        kirby_id,
        retailer (
          id,
          name,
          retailer_id,
          logos
        )`
      )
      .in('id', productIds.split(','))
      .eq('enabled', true)
      .eq('in_stock', true)
      .not('thumbnail_url', 'is', null)
      .not('display_name', 'is', null)
      .not('base_price', 'is', null)
      .not('retailer_id', 'is', null)
      .limit(limit ? Number(limit) : 100);

    const products = (data || []) as unknown as Product[];

    if (limit && products.length < Number(limit)) {
      throw new Error('Insufficient number of products found in the db');
    }

    const nProducts: FeatureLookCollectionAdDataType['moduleData'][number]['products'] = products.map((p) => ({
      id: p.id,
      productTitle: p.display_name,
      price: p.sale_price ?? p.base_price,
      base_price: p.base_price,
      discountable: !!p.sale_price,
      url: p.product_url,
      // url: p.affiliate_url,
      retailer: {
        id: p.retailer.id,
        name: p.retailer.name,
        thumbnail_url: getLogoThumbnailUrl(p.retailer.logos),
      },
      image: p.thumbnail_url,
    })) as unknown as FeatureLookCollectionAdDataType['moduleData'][number]['products'];

    const adData: FeatureLookCollectionAdDataType = {
      title,
      collection_handle: title.toLowerCase().replace(/ /g, '-'),
      description: '',
      moduleData: [
        {
          media: 'image',
          logoURL: '',
          srcURL: '',
          duration: 5000,
          title: 'Module Title',
          products: nProducts,
        },
      ],
      moduleType: 'featureLook',
      collection_url: '',
      store_handle: '',
      product_base_url: '',
      clickTag: '',
    };

    return NextResponse.json({ data: adData, error });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ data: null, error: error?.message }, { status: 500 });
  }
}
