import { config } from '@/generator/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type OptionSchema = z.infer<typeof optionSchema>;

const adFormSchema = z.object({
  publisher: optionSchema,
  selectedStores: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one store' }),
  templates: z.array(optionSchema).refine((v) => v.length > 0, { message: 'Please select at least one template' }),
  size: optionSchema,
  meta: z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
    footerText: z.string().optional(),
  }),
});

export type AdFormSchema = z.infer<typeof adFormSchema>;

export const options = {
  templates: [
    { value: config.supportedTemplates['curated-products-template'], label: 'Curated Products Template' },
    { value: config.supportedTemplates['carousel-template'], label: 'Carousel Template' },
  ],
  sizes: [
    { value: '160x600', label: 'Skyscraper (160x600)' },
    // { value: '300x250', label: '300x250' },
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
    title: 'Tastemade',
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
