'use client';

import { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { FormProvider } from 'react-hook-form';

import { Button, Card, FormField, FormSelectInput, Label } from '@/components';

import { FeatureLookCollectionAdDataType } from '@/generator/types';
import { loadEnv } from '@/generator/utils/env-utils';
import { AdFormSchema, options, OptionSchema, useFormDef } from './form';
import { MetaFields } from './meta-fields';

function AdFormBase() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [storeHandles, setCollectionHandles] = useState<OptionSchema[]>([]);

  const form = useFormDef();

  const onSubmit = async (values: AdFormSchema) => {
    setSubmitting(true);
    console.log('SUBMIT FORM', values);
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templates: values.templates.map((t) => t.value),
          size: values.size?.value,
          publisherHandles: [values.publisher.value],
          storeHandles: values.selectedStores.map((ch) => ch.value),
          meta: values.meta,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate ads.');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'embeds.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('There were errors generating the ads. Please check the console for more information.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      const response = await fetch(`/api/get-product-detail?productId=1234`, {
        method: 'GET',
      });
      const product = await response.json();
      console.log('PRODUCT', product);
    };

    fetchSupabaseData();
  }, []);

  const isLoading = isSubmitting || loadingOptions;

  console.log(form.formState.errors);
  console.log('Form Values', form.getValues());

  return (
    <Card>
      <Label size='xl' className='mb-6 block text-center'>
        Embeds Generator
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
                isDisabled={isSubmitting}
              />
            )}
          />
          <FormField
            control={form.control}
            name='selectedStores'
            render={({ field }) => (
              <FormSelectInput {...field} label='Module(s)' isMulti options={storeHandles} isLoading={loadingOptions} isDisabled={isSubmitting} />
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

          <MetaFields form={form} isSubmitting={isSubmitting} />

          <Button type='submit' disabled={isLoading} isLoading={isSubmitting}>
            Generate Embeds
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
}

export const AdForm = memo(AdFormBase);
