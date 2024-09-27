import dynamic from 'next/dynamic';
import { Loader } from './loader';

export const ExistingAds = dynamic(() => import('./existing-ads'), { ssr: false, loading: () => <Loader /> });
