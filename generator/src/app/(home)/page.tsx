'use client';

// import { ExistingAds } from './_components/existing-ads';
import { AdForm } from './_components/ad-form';
// import { useCallback, useState } from 'react';

export default function Home() {
  // const [refreshCount, setRefreshCount] = useState(0);

  // const handleRefresh = useCallback(() => {
  //   setRefreshCount((prev) => prev + 1);
  // }, []);

  return (
    <>
      <AdForm />
      {/* <ExistingAds key={refreshCount} /> */}
    </>
  );
}
