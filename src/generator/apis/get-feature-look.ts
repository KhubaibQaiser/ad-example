import axios from 'axios';
import { FeatureLookCollectionAdDataType, FLMeta, ModuleData, PublisherStore } from '../types';
import { loadEnv } from '../utils/env-utils';
import { cache } from 'react';
// import dummyResponseData from '@/generator/templates/banner-template/dummy-data.json';
import { parseCollectionToGeneratorData } from '../utils/data-parser-utils';

async function _getFeatureLookData({ publisher, storeHandle, meta }: { publisher: string; storeHandle?: string; meta: FLMeta }) {
  // const handle = storeHandle ?? 'superstore';
  loadEnv(publisher);

  const handle = 'superstore';
  const response = await axios<PublisherStore>({
    method: 'GET',
    url: `${process.env.BASE_URL}/store/custom/store/${handle}/super`,
  });

  // const response = { data: dummyResponseData };

  if (response.data) {
    // Temp write to data.json for debugging
    // fs.writeFileSync(path.join(config.tempDownloadDir, '..', 'data.json'), JSON.stringify(response.data));

    let stores = response.data.sub_stores;
    if (storeHandle) {
      stores = stores.filter((store) => store.handle === storeHandle);
    }

    const featureLookCollections = stores.reduce((collections: FeatureLookCollectionAdDataType[], subStore: PublisherStore) => {
      const flCollections = subStore.collections.filter((collection) => collection.moduleType === 'featureLook').map(parseCollectionToGeneratorData);
      return [...collections, ...flCollections];
    }, []);

    return featureLookCollections;
  }
}

export const getFeatureLookData = cache(_getFeatureLookData);
