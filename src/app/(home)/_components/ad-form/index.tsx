'use client';

import { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { FormProvider } from 'react-hook-form';

import { Button, Card, FormField, FormInput, FormSelectInput, Label } from '@/components';

import { FeatureLookCollectionAdDataType } from '@/generator/types';
import { loadEnv } from '@/generator/utils/env';
import { AdFormSchema, options, OptionSchema, useFormDef } from './form';

function AdFormBase({ handleRefresh }: { handleRefresh: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [storeHandles, setCollectionHandles] = useState<OptionSchema[]>([]);

  const form = useFormDef();

  const onSubmit = async (values: AdFormSchema) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templates: values.templates.map((t) => t.value),
          size: values.size.value,
          publisherHandles: [values.publisher.value],
          storeHandles: values.selectedStores.map((ch) => ch.value),
          meta: values.meta,
        }),
      });
      const result = await response.json();
      if (result && 'data' in result) {
        handleRefresh();
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleChangePublisher = async (publisher: OptionSchema) => {
    const getPublisherStores = async () => {
      try {
        setLoadingOptions(true);

        const { data } = await axios.post<{ data: FeatureLookCollectionAdDataType[] }>('/api/get-feature-looks', {
          publisher: publisher.value,
          meta: {},
        });

        const stores = data.data.map((d) => ({ value: d.store_handle, label: d.title }));
        setCollectionHandles(stores);
        form.reset({ ...form.getValues(), selectedStores: [] });
        loadEnv(publisher.value);
      } catch (e) {
        console.error(e);
      }
      setLoadingOptions(false);
    };
    getPublisherStores();
  };

  useEffect(() => {
    handleChangePublisher(options.publisherHandles[0]);
  }, []);

  const isLoading = isSubmitting || loadingOptions;

  console.log(form.formState.errors);

  return (
    <Card>
      <Label size='xl' className='mb-6 block text-center'>
        Ad Generator
      </Label>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='publisher'
            render={({ field }) => (
              <FormSelectInput
                label='Publisher'
                isMulti={false}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if (value) {
                    handleChangePublisher(value);
                  }
                }}
                options={options.publisherHandles}
                isLoading={loadingOptions}
                isDisabled={isSubmitting}
              />
            )}
          />
          <FormField
            control={form.control}
            name='selectedStores'
            render={({ field }) => (
              <FormSelectInput {...field} label='FL Module(s)' isMulti options={storeHandles} isLoading={loadingOptions} isDisabled={isSubmitting} />
            )}
          />

          <FormField
            control={form.control}
            name='templates'
            render={({ field }) => (
              <FormSelectInput
                {...field}
                label='Template(s)'
                isMulti
                options={options.templates}
                isLoading={loadingOptions}
                isDisabled={isSubmitting}
              />
            )}
          />

          <FormField
            control={form.control}
            name='size'
            render={({ field }) => (
              <FormSelectInput {...field} label='Size' options={options.sizes} isLoading={loadingOptions} isDisabled={isSubmitting} />
            )}
          />

          <section className='border-t pt-6 !mt-6 border-dashed'>
            <Label size='xl' className='text-center block'>
              Meta
            </Label>
            <div className='flex flex-col gap-3 mt-2'>
              <FormField
                control={form.control}
                name='meta.title'
                render={({ field }) => <FormInput {...field} label='Title' disabled={isSubmitting} />}
              />
              <FormField
                control={form.control}
                name='meta.subTitle'
                render={({ field }) => <FormInput {...field} label='Subtitle' disabled={isSubmitting} />}
              />
              <FormField
                control={form.control}
                name='meta.footerText'
                render={({ field }) => <FormInput {...field} label='Footer Text' disabled={isSubmitting} />}
              />
            </div>
          </section>

          <Button type='submit' disabled={isLoading} isLoading={isSubmitting}>
            Generate Ads
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
}

export const AdForm = memo(AdFormBase);
