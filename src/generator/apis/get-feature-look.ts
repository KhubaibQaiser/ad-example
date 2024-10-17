import axios from 'axios';
import { FeatureLookCollectionAdDataType, FLMeta, ModuleData, PublisherStore } from '../types';
import { loadEnv } from '../utils/env-utils';
import { cache } from 'react';
import path from 'path';
import { config } from '../config';
import fs from 'fs';
import dummyResponseData from '@/generator/templates/banner-template/dummy-data.json';

async function _getFeatureLookData({ publisher, storeHandle, meta }: { publisher: string; storeHandle?: string; meta: FLMeta }) {
  try {
    // const handle = storeHandle ?? 'superstore';
    loadEnv(publisher);

    const handle = 'superstore';
    // const response = await axios<PublisherStore>({
    //   method: 'GET',
    //   url: `${process.env.BASE_URL}/store/custom/store/${handle}/super`,
    // });

    const response = { data: dummyResponseData };

    if (response.data) {
      // Temp write to data.json for debugging
      fs.writeFileSync(path.join(config.tempDownloadDir, '..', 'data.json'), JSON.stringify(response.data));

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
              clickTag: `${process.env.BASE_URL}/${subStore.handle}`,
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
