import axios from 'axios';
import { FeatureLookCollectionAdDataType, PublisherStore } from '../types';

export async function getFeatureLookData({ publisher, storeHandle }: { publisher: string; storeHandle?: string }) {
  console.log('Fetching data from store...');
  try {
    const response = await axios<PublisherStore>({
      method: 'GET',
      url: `https://${publisher}.us-west-2.citadel.prod.shopsense.ai/store/custom/store/superstore/super`,
    });

    if (response.data) {
      let stores = response.data.sub_stores;
      if (storeHandle) {
        stores = stores.filter((store) => store.handle === storeHandle);
      }
      const featureLookCollections = stores.reduce((collections: FeatureLookCollectionAdDataType[], subStore: PublisherStore) => {
        const featureLookCollections = subStore.collections
          .filter((collection) => collection.moduleType === 'featureLook')
          .map(
            (collection) =>
              ({
                title: collection.title,
                handle: collection.handle,
                image_url: collection.imageUrl,
                description: collection.description,
                moduleType: collection.moduleType,
                collection_handle: subStore.handle,
                moduleData: collection.metadata.moduleData,
                productBaseUrl: `https://${publisher}.us-west-2.citadel.prod.shopsense.ai/${subStore.handle}/products/`,
              } as FeatureLookCollectionAdDataType)
          );
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
