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
export type Retailer = {
  id: number;
  name: string;
  logos: Logo[];
  retailer_id: string;
};
export type Product = {
  id: number;
  display_name: string;
  base_price: number;
  sale_price?: any;
  thumbnail_url: string;
  handle?: any;
  product_url: string;
  affiliate_url: string;
  kirby_id?: any;
  retailer: Retailer;
  image: string;
};
export type ModuleDatum = {
  logoURL: string;
  title: string;
  products: Product[];
};
export type Data = {
  title: string;
  collection_handle: string;
  description: string;
  moduleData: ModuleDatum[];
};
