import { ChangeEvent } from 'react';

type InputProps = {
  label: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (value: string) => void;
};

export function Input({ label, value, disabled = false, onChange, onChangeText }: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onChangeText?.(e.target.value);
  };

  return (
    <div>
      <label className='block text-gray-700 font-semibold'>{label}</label>
      <input
        type='text'
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className='mt-1 block w-full text-gray-800  h-10 rounded-[4px] px-2 focus:outline-none ring-1 ring-gray-400 focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
}
