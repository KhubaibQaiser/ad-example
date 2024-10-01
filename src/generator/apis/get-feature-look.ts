import axios from 'axios';
// import Medusa from '@medusajs/medusa-js';
import { FeatureLookCollectionAdDataType, FLMeta, ModuleData, PublisherStore } from '../types';
import { loadEnv } from '../utils/env';
import { cache } from 'react';

async function _getFeatureLookData({ publisher, storeHandle, meta }: { publisher: string; storeHandle?: string; meta: FLMeta }) {
  try {
    // const handle = storeHandle ?? 'superstore';
    loadEnv(publisher);
    // const medusaClient = new Medusa({
    //   baseUrl: process.env.BASE_URL || '',
    //   maxRetries: 3,
    //   customHeaders: {
    //     'cache-control': 'public, max-age=3600, stale-while-revalidate=3660',
    //   },
    // });

    const handle = 'superstore';
    const response = await axios<PublisherStore>({
      method: 'GET',
      url: `${process.env.BASE_URL}/store/custom/store/${handle}/super`,
    });

    if (response.data) {
      let stores = response.data.sub_stores;
      if (storeHandle) {
        stores = stores.filter((store) => store.handle === storeHandle);
      }
      const featureLookCollections = stores.reduce((collections: FeatureLookCollectionAdDataType[], subStore: PublisherStore) => {
        const flCollections = subStore.collections
          .filter((collection) => collection.moduleType === 'featureLook')
          .map((collection) => {
            const flData: FeatureLookCollectionAdDataType = {
              title: collection.title,
              image_url: collection.imageUrl,
              description: collection.description,
              moduleType: 'featureLook',
              collection_handle: collection.handle,
              store_handle: subStore.handle,
              collection_url: `${process.env.BASE_URL}/${subStore.handle}/collections/${collection.handle}`,
              moduleData: collection.metadata.moduleData as ModuleData[],
              product_base_url: `${process.env.BASE_URL}/${subStore.handle}/products/`,
              meta,
            };
            return flData;
          });
        return [...collections, ...flCollections];
      }, []);

      return featureLookCollections;
    }
  } catch (error) {
    console.error('Error fetching data from store:', error);
  }
  console.error('Error fetching data from store');
  throw new Error('Error fetching data from store');
}

export const getFeatureLookData = cache(_getFeatureLookData);
