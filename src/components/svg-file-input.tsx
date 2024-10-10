/* eslint-disable react/display-name */
import { ChangeEvent, forwardRef, useRef, useState } from 'react';
import { FormControl, FormItem, FormMessage } from './form';
import { twMerge } from 'tailwind-merge';
import { Label } from './label';
import { mergeRefs, readSvgFile } from '@/generator/utils/react-utils';
import Image from 'next/image';

type SvgInputProps = {
  label: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (base64: string) => void;
};

export const FormSvgInputInput = forwardRef<HTMLInputElement, SvgInputProps & { formItemClassName?: string }>(
  ({ label, formItemClassName, className, onChange, value, disabled, ...props }, ref) => {
    console.log('SVG', value);

    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      setFile(selectedFile ?? null);
      if (selectedFile) {
        try {
          const svgContent = await readSvgFile(selectedFile);
          onChange?.(svgContent);
        } catch {
          onChange?.('');
        }
      } else {
        onChange?.('');
      }
    };

    const toggleFileSelection = () => {
      if (inputRef.current) {
        if (file) {
          inputRef.current.value = '';
          handleFileChange({ target: { files: null } } as ChangeEvent<HTMLInputElement>);
        } else {
          inputRef.current.click();
        }
      }
    };

    return (
      <FormItem className={formItemClassName}>
        <FormControl>
          <>
            <Label>{label}</Label>
            <div
              className={twMerge(
                'relative mt-1 w-full flex gap-2 items-center text-gray-800 h-10 rounded-[4px] px-2 focus:outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400',
                className,
                disabled && 'bg-gray-100 pointer-events-none'
              )}
            >
              <p className={twMerge('flex-1 text-gray-400', file?.name && 'text-gray-800', disabled && 'text-gray-400')}>
                {file?.name ?? 'No file selected'}
              </p>
              <div
                onClick={toggleFileSelection}
                className={twMerge(
                  'size-7 p-1 rounded-full flex justify-center items-center opacity-50 hover:opacity-100 hover:cursor-pointer hover:bg-gray-50',
                  disabled && 'opacity-25'
                )}
              >
                <Image
                  src={file ? 'assets/icons/cross-icon.svg' : '/assets/icons/file-icon.svg'}
                  width={24}
                  height={24}
                  alt='Select File'
                  className='size-4'
                />
              </div>
            </div>
            <input
              {...props}
              ref={mergeRefs([inputRef, ref])}
              type='file'
              accept='.svg'
              value=''
              disabled={disabled}
              onChange={handleFileChange}
              className='hidden'
            />
            <FormMessage />
          </>
        </FormControl>
      </FormItem>
    );
  }
);
