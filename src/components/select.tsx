import React from 'react';
import Select, { Props as SelectProps, MultiValue, SingleValue } from 'react-select';

export type SelectInputProps<T, M extends boolean> = Omit<SelectProps<T, M>, 'onChange'> & {
  label: string;
  onChange: M extends true ? (value: T[]) => void : (value: T) => void;
};

export function SelectInput<T, M extends boolean = true>({ label, isMulti, onChange, ...props }: SelectInputProps<T, M>) {
  const handleChange: SelectProps<T, M>['onChange'] = (value) => {
    onChange(value as T[] & T);
  };

  return (
    <div>
      <label className='block text-gray-700 font-semibold'>{label}</label>
      <Select isMulti={isMulti} onChange={handleChange} {...props} className='mt-1 block w-full text-gray-800' />
    </div>
  );
}

export type { MultiValue, SingleValue };
