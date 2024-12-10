/* eslint-disable react/display-name */
import { ChangeEvent, forwardRef } from 'react';
import { FormControl, FormItem, FormMessage } from './form';
import { twMerge } from 'tailwind-merge';
import { Label } from './label';

type InputProps = {
  label: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (value: string) => void;
};

export const FormInput = forwardRef<HTMLInputElement, InputProps & { formItemClassName?: string }>(
  ({ label, formItemClassName, className, ...props }, ref) => (
    <FormItem className={formItemClassName}>
      <FormControl>
        <>
          <Label>{label}</Label>
          <input
            ref={ref}
            type='text'
            {...props}
            className={twMerge(
              'mt-1 block w-full text-gray-800 h-10 rounded-[4px] px-2 focus:outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400',
              className
            )}
          />
          <FormMessage />
        </>
      </FormControl>
    </FormItem>
  )
);
