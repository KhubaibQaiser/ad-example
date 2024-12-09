import { ButtonHTMLAttributes } from 'react';
import { Spinner } from './spinner';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
  isLoading?: boolean;
};

export function Button({ isLoading = false, disabled = false, children, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'relative w-full py-2 px-4 !mt-8 flex justify-center items-center disabled:bg-gray-600 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
        isLoading && 'text-gray-300'
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className='absolute w-5 h-5 text-gray-100' />}
      {children}
    </button>
  );
}
