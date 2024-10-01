import React from 'react';

import { twMerge } from 'tailwind-merge';

export type HelperTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  valid?: boolean;
};

export const HelperText = React.forwardRef<HTMLSpanElement, HelperTextProps>((props, ref) => {
  const { children, valid, className, ...other } = props;

  const validationStyle = (iValid: boolean | undefined): string => {
    switch (iValid) {
      case true:
        return 'text-gray-700';
      case false:
        return 'text-red-400';
      default:
        return '';
    }
  };

  const cls = twMerge('text-xs', validationStyle(valid), className);

  return (
    <span className={cls} ref={ref} {...other}>
      {children}
    </span>
  );
});
