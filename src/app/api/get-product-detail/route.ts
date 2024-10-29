import { supabase } from '@/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get the product ID from the request query parameters
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const { data: product, error } = await supabase
    .from('product')
    .select(
      `
      id,
      display_name,
      description,
      base_price,
      sale_price,
      thumbnail_url,
      handle,
      product_url,
      retailer (
        id,
        name,
        retailer_id,
        logos
      )`
    )
    .eq('id', productId)
    .eq('enabled', true)
    .eq('in_stock', true)
    .single();

  console.log('FETCHED PRODUCT', { product, error });
  // Fetch the product details from your database or API
  // Replace this with your actual implementation
  // const product = {
  //   id: productId,
  //   name: 'Example Product',
  //   price: 9.99,
  //   description: 'This is an example product',
  // };

  // Return the product details as JSON response
  return NextResponse.json({ data: product, error });
}
