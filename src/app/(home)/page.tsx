'use client';

import { ExistingAds } from './_components/existing-ads';
import { AdForm } from './_components/ad-form';

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-900 flex flex-col gap-4 items-center justify-center py-4'>
      <AdForm />
      <ExistingAds />
    </div>
  );
}
