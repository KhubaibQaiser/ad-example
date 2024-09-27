import { Card } from '@/components/card';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Card className='pb-6'>
      <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>Generated Ads</h1>
      {children}
    </Card>
  );
}
