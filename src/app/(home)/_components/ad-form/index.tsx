'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { Card, Input, SelectInput } from '@/components';
import { config } from '@/generator/config';
import { FeatureLookCollectionAdDataType, FLMeta } from '@/generator/types';
import axios from 'axios';
import { loadEnv } from '@/generator/utils/env';

type Option = {
  label: string;
  value: string;
};

const options = {
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

function AdFormBase({ handleRefresh }: { handleRefresh: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const metaRef = useRef<FLMeta>({
    title: 'Tastemade',
    subTitle: 'Discover & Shop!',
    footerText: 'Custom curated collections from your favorite shows!',
  });

  const [publisher, setStoreHandle] = useState<Option>(options.publisherHandles[0]);
  const [storeHandles, setCollectionHandles] = useState<Option[]>([]);
  const [selectedStores, setSelectedStores] = useState<Option[]>([]);
  const [templates, setTemplates] = useState<Option[]>(options.templates.slice(0, 1));
  const [size, setSize] = useState<Option>(options.sizes[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) {
      return;
    }
    if (templates.length === 0 || selectedStores.length === 0) {
      alert('Please select at least one template and store');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templates: templates.map((t) => t.value),
          size: size.value,
          publisherHandles: [publisher.value],
          storeHandles: selectedStores.map((ch) => ch.value),
          meta: metaRef.current,
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

  useEffect(() => {
    const getPublisherStores = async () => {
      try {
        setLoadingOptions(true);
        setSelectedStores([]);

        const { data } = await axios.post<{ data: FeatureLookCollectionAdDataType[] }>('/api/get-feature-looks', {
          publisher: publisher.value,
          meta: metaRef.current,
        });

        setCollectionHandles(data.data.map((d) => ({ value: d.collection_handle, label: d.title })));
        loadEnv(publisher.value);
      } catch (e) {
        console.error(e);
      }
      setLoadingOptions(false);
    };
    getPublisherStores();
  }, [publisher]);

  const isLoading = isSubmitting || loadingOptions;

  return (
    <Card>
      <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>Ad Generator</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <SelectInput<Option, false>
          label='Publisher'
          value={publisher}
          onChange={setStoreHandle}
          options={options.publisherHandles}
          isLoading={loadingOptions}
          isDisabled={isSubmitting}
        />
        <SelectInput
          label='FL Module(s)'
          value={selectedStores}
          isMulti
          onChange={setSelectedStores}
          options={storeHandles}
          isLoading={loadingOptions}
          isDisabled={isSubmitting}
        />

        <SelectInput
          label='Template(s)'
          value={templates}
          isMulti
          onChange={setTemplates}
          options={options.templates}
          isLoading={loadingOptions}
          isDisabled={isSubmitting}
        />
        <SelectInput<Option, false>
          label='Size'
          value={size}
          onChange={setSize}
          options={options.sizes}
          isLoading={loadingOptions}
          isDisabled={isSubmitting}
        />

        <section className=''>
          <h2 className='text-lg font-semibold text-gray-700'>Meta</h2>
          <div className='px-2 flex flex-col gap-3 mt-2'>
            <Input label='Title' onChangeText={(value) => (metaRef.current.title = value)} disabled={isSubmitting} />
            <Input label='Subtitle' onChangeText={(value) => (metaRef.current.subTitle = value)} disabled={isSubmitting} />
            <Input label='Footer Text' onChangeText={(value) => (metaRef.current.footerText = value)} disabled={isSubmitting} />
          </div>
        </section>

        <button
          type='submit'
          className='w-full py-2 px-4 !mt-8 disabled:bg-gray-600 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          disabled={isLoading}
        >
          {isSubmitting ? 'Generating Ads...' : 'Generate Ads'}
        </button>
      </form>
    </Card>
  );
}

export const AdForm = memo(AdFormBase);
