import { cache } from 'react';
import { ProductPreview } from '../types';
import Medusa from '@medusajs/medusa-js';

const _getProductByHandle = async function (medusaClient: Medusa, handle: string, salesChannelId: string): Promise<{ product: ProductPreview }> {
  const product = await medusaClient.products
    .list({ handle, sales_channel_id: [salesChannelId] })
    .then(({ products }) => products[0])
    .catch((err) => {
      throw err;
    });

  return { product: product as unknown as ProductPreview };
};

export const getProductByHandle = cache(_getProductByHandle);
