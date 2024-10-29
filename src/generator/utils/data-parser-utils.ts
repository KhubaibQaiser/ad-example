import { FeatureLookCollectionAdDataType, ModuleData, ProductCollectionExtended } from '../types';

export function parseCollectionToGeneratorData(collection: ProductCollectionExtended): FeatureLookCollectionAdDataType {
  const storeHandle = 'todo-store-handle';
  const flData: FeatureLookCollectionAdDataType = {
    title: collection.title,
    image_url: collection.imageUrl,
    description: collection.description,
    moduleType: 'featureLook',
    collection_handle: collection.handle,
    store_handle: storeHandle,
    collection_url: `${process.env.BASE_URL}/${storeHandle}/collections/${collection.handle}`,
    clickTag: `${process.env.BASE_URL}/${storeHandle}`,
    moduleData: collection.metadata.moduleData as ModuleData[],
    product_base_url: `${process.env.BASE_URL}/${storeHandle}/products/`,
  };
  return flData;
}
