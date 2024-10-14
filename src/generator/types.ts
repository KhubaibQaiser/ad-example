import { Product, ProductCollection } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

export type ProductPreview = Product & {
  price: string;
  base_price: string;
  url: string;
  retailer: ProductRetailer;
  order: number;
  non_affiliate_url?: string;
  image?: string;
};

export type ProductRetailer = {
  name: string;
  description: string;
  handle: string;
  thumbnail_url: string;
  image_url: string;
  affiliate: ProductAffiliate;
};

export type ProductAffiliate = {
  name: string;
  description: string;
  handle: string;
  params: Array<string>;
  subParams: Array<string>;
};

export type LensConfig = {
  excludedWords: string[]; // Example: ["sweatpant", "jogger"]
  exclusionFilterValues: Record<string, string>; // Example: {"product_type": "Underwear & Sleepwear"}
  inclusiveFilterValues: Record<string, string>; // Example: {"product_type": "Pants"}
};

export type ProductCollectionWithPreviews = Omit<ProductCollection, 'products'> & {
  products: ProductPreview[];
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  is_sponsored?: boolean;
  moduleType?: 'featureLook' | string;
};

export type ProductCollectionExtended = ProductCollection & {
  imageUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  is_sponsored?: boolean;
  moduleType?: string;
};

type BaseStoreHero = {
  title: string;
  subtitle: string;
  brandLogoImage: string;
  backgroundImage: string;
  brandLogoImageAlt: string;
  backgroundImageAlt: string;
  brandLogoImageSize?: string;
};

export type DefaultHero = BaseStoreHero & {
  type: 'DEFAULT';
};
export type LensHero = BaseStoreHero & {
  type: 'LENS';
  lensCTA?: {
    ctaBackdropImage: string;
    ctaBackdropImageAlt: string;
    ctaNewIcon: boolean;
    ctaHeaderText: string;
    ctaDescriptionText: string;
    ctaText: string;
    ctaNewIconColors?: {
      backgroundGradient: {
        fromColor: string;
        viaColor: string;
        toColor: string;
      };
      textColor: string;
    };
    ctaColors?: {
      backgroundColor: string;
      backgroundHoverColor: string;
      textColor: string;
    };
    ctaBackdropSize: {
      width: number;
      height: number;
    };
  };
};
export type FullSizedHero = BaseStoreHero & {
  type: 'FULLSIZE';
};

export type StoreHero = DefaultHero | LensHero | FullSizedHero;

export type PublisherStore = {
  handle: string;
  displayName: string;
  analyticsHandle: string | null;
  description: string;
  hero: StoreHero;
  logo: {
    navImage: string;
    navImageAlt: string;
  };
  link: {
    image: string;
  };
  storeCollectionConfig: {
    featuredLook?: {
      title: string;
    };
    titleEnabled: boolean;
    storeHeroLogoEnabled: boolean;
  } | null;
  footer: {
    copyright: string;
    contactUsPage: boolean;
    builtByShopSense: boolean;
    privacyPolicyUrl: string;
  };
  storeDisabled?: boolean | null;
  storeDisabledContent: {
    hero: {
      brandLogoImage: string;
      brandLogoImageAlt: string;
    };
    home: {
      content: string;
    };
  } | null;
  stores: string[];
  publisher: {
    name: string;
    analyticsHandle: string;
  } | null;
  metadata: {
    app?: {
      enableLens: false;
      enableSearch: false;
      enableRecentlyViewed: false;
    } | null;
    lensConfig?: LensConfig;
    twitter?: {
      creator: string;
      store: string;
    };
    paramount?: {
      cmpId: string;
    };
    subAffiliates?: {
      ascend: string;
      cj: string;
      partnerize: string;
      rakuten: string;
    };
    navigationMenu?: {
      text: string;
      handle: string;
    }[];
    faviconUrl?: string;
  };
  metaConfig: unknown;
  id: string;
  created_at: string;
  updated_at: string;
  collections: ProductCollectionExtended[];
  sub_stores: PublisherStore[];
  name: string;
  default_sales_channel_id: string;
};

export type StoreExtended = PublisherStore;

export interface ItemProductSponsor extends PricedProduct {
  price: string;
  base_price: string;
  retailer: ProductRetailer;
}

export type SponsordImage = { id: number; image: string };

export enum ShuffleMode {
  Sponsor = 'sponsor',
  Products = 'products',
}

export enum CustomCollections {
  featureLooks = 'featureLook',
  shuffle = 'shuffle',
}

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DetectedObjects = {
  label: string;
  bounding_box: BoundingBox;
  similar_products: ProductPreview[];
};

export type LensMatchPoints = {
  session_id: string;
  detected_objects: DetectedObjects[];
};

export type LensResponse = {
  session_id: string;
  detected_objects: DetectedObjects[];
};

export type LensResult = {
  label: string;
  status: string;
  similar_products: ProductPreview[];
};

export interface MatchPoint {
  label: string;
  index: number;
}

export type FLMeta = {
  title: string;
  subTitle: string;
  footerText: string;
};

export type ModuleData = {
  media: 'image' | 'video';
  title: string;
  srcURL: string;
  duration: number;
  products: ProductPreview[];
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
  meta: FLMeta;
  clickTag: string;
};
