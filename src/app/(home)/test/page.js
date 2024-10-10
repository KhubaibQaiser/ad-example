'use client';

import Script from 'next/script';

export default function TestEmbed() {
  const initEmbed = () => {
    if (window && 'ShopsenseEmbeds' in window && window.ShopsenseEmbeds) {
      try {
        window.ShopsenseEmbeds.loadAd({
          containerId: 'tools', // required
          embedId: 'shop-the-shorts', // required
          template: window.ShopsenseEmbeds.SupportedTemplates.CuratedProducts, // required
          // variation: window.ShopsenseEmbeds.SupportedVariations.Skyscraper, // optional
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <Script src='/embed-injector.min.js?v=1.1' defer onLoad={initEmbed} />
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-white text-2xl'>Embed Injector Test</h1>
        <div id='tools'></div>
      </div>
    </>
  );
}
