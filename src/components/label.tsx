import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type LabelProps = HTMLAttributes<HTMLLabelElement> & {
  size?: 'lg' | 'xl';
};

const getTextSize = (size: LabelProps['size']) => {
  switch (size) {
    case 'xl':
      return 'text-2xl';
    case 'lg':
    default:
      return 'text-lg';
  }
};

export function Label({ children, className, size = 'lg', ...props }: LabelProps) {
  return (
    <label {...props} className={twMerge('font-semibold text-gray-800', getTextSize(size), className)}>
      {children}
    </label>
  );
}
