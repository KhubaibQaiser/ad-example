import { formatPrice, getDiscountPercentage, showDiscount } from './utils';

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
export type GeneratorRetailer = Omit<Retailer, 'logos'>;
export type ProductCollection = {
    collection_id: number;
    display_name: string;
    name: string;
    handle: string;
};
export type Product = {
    id: number;
    name: string;
    notes?: string;
    handle?: string;
    enabled: boolean;
    in_stock: boolean;
    kirby_id?: number;
    retailer: Retailer;
    store_id: number;
    subtitle: string;
    base_price: number;
    sale_price?: number;
    discountable?: boolean;
    description: string;
    product_url?: string;
    retailer_id?: number;
    display_name: string;
    affiliate_url?: string;
    thumbnail_url: string;
    additional_image_urls: string[];
    collection: ProductCollection;
    created_at: string;
};

export type UtmType = {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
};

export type TrackingPayloadType = {
    embed_id: string;
    campaign_id: string;
    utms: UtmType;
};

export type GeneratorMeta = {
    title: string;
    subtitle?: string;
    logo?: string; // SVG String
    clickTag?: string;
    width: number;
    height: number;
    tracking: TrackingPayloadType;
};

export type GeneratorUtils = {
    formatPrice: typeof formatPrice;
    showDiscount: typeof showDiscount;
    getDiscountPercentage: typeof getDiscountPercentage;
};

export type GeneratorProduct = Pick<
    Product,
    | 'id'
    | 'display_name'
    | 'sale_price'
    | 'base_price'
    | 'discountable'
    | 'product_url'
    | 'affiliate_url'
    | 'thumbnail_url'
    | 'collection'
> & {
    retailer: GeneratorRetailer;
    ad_click_event_tracking_id: string;
};

export type ModuleData = {
    media: 'image' | 'video';
    srcURL: string;
    products: GeneratorProduct[];
};

export type EmbedGeneratorPayload = {
    title: string;
    collection_id: number;
    collection_handle: string;
    image_url?: string; // Main Background Image
    modules: ModuleData[];
    meta: GeneratorMeta;
};

export type TemplateGeneratorPayload = {
    data: EmbedGeneratorPayload;
    utils: GeneratorUtils;
    outputAdDir: string;
    templateDir: string;
    width: number;
};

export type TemplateGeneratorSuccessResponse = boolean;

export type TemplateGeneratorErrorResponse = {
    message: string;
};

export type TemplateGeneratorResponse = TemplateGeneratorSuccessResponse | TemplateGeneratorErrorResponse;

export type TemplateGeneratorHandler = (
    payload: TemplateGeneratorPayload,
) => Promise<TemplateGeneratorSuccessResponse | TemplateGeneratorErrorResponse>;

export type GeneratorEventPayload = {
    collection_id: string;
    store_url: string;
    limit_products: string;
    template: string;
    template_logo: ParsedFile;
    template_title: string;
    template_subtitle: string;
    template_width: number;
    template_height: number;
    embed_id: string;
    campaign_id: string;
    utm_config: string;
};

export type ParsedFile = {
    filename: string;
    contentType: string;
    content: Buffer;
};
