import { forwardRef } from 'react';
import Select, { SelectInstance, Props as SelectProps } from 'react-select';
import { FormControl, FormItem, FormMessage } from './form';
import { Label } from './label';

type SelectInputProps<T, M extends boolean> = SelectProps<T, M> & { label: string; formItemClassName?: string };

const SelectInput = forwardRef<SelectInstance<any, boolean>, SelectInputProps<any, boolean>>(
  ({ label, formItemClassName, isMulti = false, ...props }, ref) => (
    <FormItem className={formItemClassName}>
      <FormControl>
        <>
          <Label>{label}</Label>
          <Select ref={ref} isMulti={isMulti} {...props} className='mt-1 block w-full text-gray-800' />
          <FormMessage />
        </>
      </FormControl>
    </FormItem>
  )
);

export const FormSelectInput = SelectInput as <T, M extends boolean = false>(props: SelectInputProps<T, M>) => JSX.Element;
