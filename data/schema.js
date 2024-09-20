const { z } = require('zod');

const productSchema = z.object({
  id: z.number(),
  image: z.string().url(),
  handle: z.string(),
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
  image_url: z.string().url(),
  description: z.string(),
  moduleType: z.string(),
  moduleData: z.array(moduleDataSchema),
  products: z.array(z.unknown()),
});

module.exports = validationSchema;
