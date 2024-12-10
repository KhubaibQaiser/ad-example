import { PublisherStore } from '@/generator/types';

export type Format = {
  src: string;
  size: number;
  width?: number;
  format: string;
  height?: number;
  background?: string;
};
export type Logo = {
  type: string;
  theme: string;
  formats: Format[];
};
export type ProductAffiliate = {
  name: string;
  description: string;
  handle: string;
  params: Array<string>;
  subParams: Array<string>;
};
export type Retailer = {
  id: number;
  name: string;
  logos: Logo[];
  thumbnail_url: string;
  retailer_id: string;
  affiliate: ProductAffiliate;
};
export type ProductCollection = {
  collection_id: number;
  display_name: string;
  name: string;
  handle: string;
};
export type Product = {
  id: number;
  display_name: string;
  price: number;
  base_price: number;
  sale_price?: number;
  discountable: boolean;
  thumbnail_url: string;
  handle?: any;
  product_url: string;
  url: string; // TODO: Fix it; For now, it's the same as 'product_url'
  non_affiliate_url: string; // TODO: Fix it; For now, it's the same as 'product_url'
  affiliate_url: string;
  kirby_id?: any;
  retailer?: Retailer;
  image: string;
  ad_click_event_tracking_id: string;
  collection: ProductCollection;
};
export type ModuleData = {
  media: 'image' | 'video';
  title: string;
  srcURL: string;
  logoURL?: string;
  duration: number;
  products: Product[];
};

export type FLMeta = {
  title: string;
  subTitle: string;
  footerText: string;
};

export type FeatureLookCollectionAdDataType = {
  title: string;
  image_url?: string;
  description?: string;
  moduleType: 'featureLook';
  collection_handle: PublisherStore['handle'];
  collection_url: string;
  store_handle: PublisherStore['handle'];
  moduleData: ModuleData[];
  product_base_url: string;
  meta?: FLMeta;
  clickTag: string;
};
