import * as z from 'zod';

const productSchema = z.object({
  id: z.string(),
  image: z.string().url(),
  price: z.number(),
  handle: z.string(),
  retailer: z.string(),
  affiliate: z.string(),
  collectionID: z.string(),
  productTitle: z.string(),
  retailerHandle: z.string(),
  affiliateHandle: z.string(),
  collectionTitle: z.string(),
  productSubtitle: z.string(),
});

const moduleDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  media: z.enum(['video', 'image']),
  duration: z.number(),
  srcURL: z.string().url(),
  backdropUrl: z.string().url(),
  products: z.array(productSchema),
});

const validationSchema = z.object({
  title: z.string(),
  image_url: z.string().url().optional(),
  description: z.string(),
  moduleType: z.string(),
  moduleData: z.array(moduleDataSchema),
  collection_handle: z.string(),
  products: z.array(productSchema).optional(),
});

module.exports = validationSchema;
