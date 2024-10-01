'use client';

import { ExistingAds } from './_components/existing-ads';
import { AdForm } from './_components/ad-form';
import { useCallback, useState } from 'react';

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col gap-4 items-center justify-center py-4'>
      <AdForm handleRefresh={handleRefresh} />
      <ExistingAds key={refreshCount} />
    </div>
  );
}
