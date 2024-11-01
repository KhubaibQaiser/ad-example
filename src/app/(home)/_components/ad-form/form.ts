import { config } from '@/generator/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type OptionSchema<T = string> = Omit<z.infer<typeof optionSchema>, 'value'> & {
  value: T;
};

const templateOptions: OptionSchema<keyof typeof config.supportedTemplates>[] = [
  { value: 'CuratedProductsTemplate', label: 'Curated Products Template' },
  { value: 'CarouselTemplate', label: 'Carousel Template' },
  { value: 'BannerTemplate', label: 'Banner Template' },
];

export const options = {
  templates: templateOptions,
  sizes: [
    { value: '160x600', label: 'Skyscraper (160x600)' },
    { value: '912x384', label: 'Banner (912x384)' },
  ],
  publisherHandles: [
    { value: 'tastemade', label: 'Tastemade' },
    { value: 'paramount', label: 'Paramount' },
    { value: 'cw', label: 'CW' },
  ],
};

export const hasCuratedTemplate = (templates: OptionSchema[]) =>
  templates.some((template: OptionSchema) => template.value.toLowerCase().includes('curated'));

const adFormSchema = z
  .object({
    publisher: optionSchema,
    selectedStores: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one store' }),
    templates: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one template' }),
    size: optionSchema.nullable(),
    meta: z
      .object({
        logo: z
          .string()
          .optional()
          .refine((value) => (!value ? true : value.toLowerCase().startsWith('<svg')), { message: 'Logo must be a valid SVG' }),
        subTitle: z.string().optional(),
        footerText: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      return !!data.size;
    },
    {
      message: 'Please select a Size',
      path: ['size'],
    }
  )
  .superRefine((data, ctx) => {
    const hasCurated = hasCuratedTemplate(data.templates);
    if (hasCurated) {
      if (!data.meta) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Meta is required when using the Curated Products Template',
          path: ['meta'],
        });
      } else {
        if (!data.meta.logo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Logo is required when using the Curated Products Template',
            path: ['meta', 'logo'],
          });
        }
        if (!data.meta.subTitle) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Subtitle is required when using the Curated Products Template',
            path: ['meta', 'subTitle'],
          });
        }
        if (!data.meta.footerText) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Footer Text is required when using the Curated Products Template',
            path: ['meta', 'footerText'],
          });
        }
      }
    }
  });

export type AdFormSchema = z.infer<typeof adFormSchema>;

const defaultValues: AdFormSchema = {
  publisher: options.publisherHandles[0],
  selectedStores: [],
  templates: [],
  size: null,
  meta: {
    subTitle: 'Discover & Shop!',
    footerText: 'Custom curated collections from your favorite shows!',
  },
};

export function useFormDef() {
  return useForm<AdFormSchema>({
    resolver: zodResolver(adFormSchema),
    defaultValues,
  });
}
