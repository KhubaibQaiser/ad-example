import { ChangeEvent } from 'react';

type InputProps = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeText: (value: string) => void;
};

export function Input({ label, value, onChange, onChangeText }: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    onChangeText(e.target.value);
  };

  return (
    <div>
      <label className='block text-gray-700'>{label}</label>
      <input type='text' value={value} onChange={handleChange} />
    </div>
  );
}
