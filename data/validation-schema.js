const z = require('zod');

module.exports = z.object({
  slug: z.string(),
  products: z.array(
    z.object({
      name: z.string(),
      img: z.string(),
      bgColor: z.string(),
      suggestions: z.array(
        z.object({
          name: z.string(),
          img: z.string(),
          url: z.string().url(),
        })
      ),
    })
  ),
});
