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
    const collectionId = searchParams.get('collection_id'); // comma separated

    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('collection_product')
      .select(
        `
        collection (
          display_name
        ),
        product (
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
          )
        )`
      )
      .eq('collection_id', Number(collectionId));

    const products = (data || []) as unknown as { collection: { display_name: string }; product: Product }[];

    const nProducts: FeatureLookCollectionAdDataType['moduleData'][number]['products'] = products.map(({ product: p }) => ({
      id: p.id,
      productTitle: p.display_name,
      price: p.sale_price ?? p.base_price,
      base_price: p.base_price,
      discountable: !!p.sale_price,
      url: p.product_url,
      retailer: {
        id: p.retailer.id,
        name: p.retailer.name,
        thumbnail_url: getLogoThumbnailUrl(p.retailer.logos),
      },
      image: p.thumbnail_url,
    })) as unknown as FeatureLookCollectionAdDataType['moduleData'][number]['products'];

    const title = products[0].collection.display_name;

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
