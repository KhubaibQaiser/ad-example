'use server';

import { getExistingAds } from '../../_actions/get-existing-ads';
import { Layout } from './layout';

export default async function ExistingAds() {
  const ads = await getExistingAds();

  // const openAd = (url: string) => () => {
  //   window.open(url, '_blank');
  // };

  return (
    <Layout>
      {ads.length > 0 ? (
        <ul className='list-disc text-gray-800'>
          {ads.map(({ url, name }) => (
            <li key={name}>
              <a href={url} className='text-blue-500 hover:underline' target='_blank'>
                {name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-800 text-center'>No ads found. Generate some by filling out the form above.</p>
      )}
    </Layout>
  );
}
