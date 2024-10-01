import axios from 'axios';
import { FeatureLookCollectionAdDataType, FLMeta, PublisherStore } from '../types';

export async function getFeatureLookData({ publisher, storeHandle, meta }: { publisher: string; storeHandle?: string; meta: FLMeta }) {
  try {
    // const handle = storeHandle ?? 'superstore';
    const handle = 'superstore';
    const response = await axios<PublisherStore>({
      method: 'GET',
      url: `https://${publisher}.us-west-2.citadel.prod.shopsense.ai/store/custom/store/${handle}/super`,
    });

    if (response.data) {
      let stores = response.data.sub_stores;
      if (storeHandle) {
        stores = stores.filter((store) => store.handle === storeHandle);
      }
      console.log('BASE_URL', process.env.BASE_URL);
      const featureLookCollections = stores.reduce((collections: FeatureLookCollectionAdDataType[], subStore: PublisherStore) => {
        const featureLookCollections = subStore.collections
          .filter((collection) => collection.moduleType === 'featureLook')
          .map((collection) => {
            const flData: FeatureLookCollectionAdDataType = {
              title: collection.title,
              handle: collection.handle,
              image_url: collection.imageUrl,
              description: collection.description,
              moduleType: 'featureLook',
              collection_handle: subStore.handle,
              moduleData: collection.metadata.moduleData,
              // TODO: Update this to use the correct base URL
              productBaseUrl: `https://${publisher}.us-west-2.citadel.prod.shopsense.ai/${subStore.handle}/products/`,
              meta,
            };
            return flData;
          });
        return [...collections, ...featureLookCollections];
      }, []);

      return featureLookCollections;
    }
  } catch (error) {
    console.error('Error fetching data from store:', error);
  }
  console.error('Error fetching data from store');
  throw new Error('Error fetching data from store');
}
