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

const adFormSchema = z
  .object({
    publisher: optionSchema,
    selectedStores: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one store' }),
    templates: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one template' }),
    size: optionSchema,
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
      const hasCuratedTemplate = data.templates.some((template) => template.value === config.supportedTemplates.CuratedProductsTemplate);
      if (hasCuratedTemplate) {
        return !!data.meta;
      }
      return true;
    },
    {
      message: 'Meta is required when using the Curated Products Template',
      path: ['meta'],
    }
  )
  .refine(
    (data) => {
      const hasCuratedTemplate = data.templates.some((template) => template.value === config.supportedTemplates.CuratedProductsTemplate);
      if (hasCuratedTemplate) {
        return !!data.meta && data.meta.logo;
      }
      return true;
    },
    {
      message: 'Logo is required when using the Curated Products Template',
      path: ['meta', 'logo'],
    }
  )
  .refine(
    (data) => {
      const hasCuratedTemplate = data.templates.some((template) => template.value === config.supportedTemplates.CuratedProductsTemplate);
      if (hasCuratedTemplate) {
        return !!data.meta && data.meta.subTitle;
      }
      return true;
    },
    {
      message: 'Subtitle is required when using the Curated Products Template',
      path: ['meta', 'subTitle'],
    }
  )
  .refine(
    (data) => {
      const hasCuratedTemplate = data.templates.some((template) => template.value === config.supportedTemplates.CuratedProductsTemplate);
      if (hasCuratedTemplate) {
        return !!data.meta && data.meta.footerText;
      }
      return true;
    },
    {
      message: 'Footer Text is required when using the Curated Products Template',
      path: ['meta', 'footerText'],
    }
  );

export type AdFormSchema = z.infer<typeof adFormSchema>;

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
  ],
};

const defaultValues: AdFormSchema = {
  publisher: options.publisherHandles[0],
  selectedStores: [],
  templates: [],
  size: options.sizes[0],
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
