'use server';

import { getExistingAds } from '../../_actions/get-existing-ads';
import { Layout } from './layout';

export default async function ExistingAds() {
  const ads = await getExistingAds();

  return ads.length > 0 ? (
    <Layout>
      <ul className='list-disc text-gray-800'>
        {ads.map(({ url, name }) => (
          <li key={name}>
            <a href={url} className='text-blue-500 hover:underline' target='_blank'>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  ) : null;
}
