import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return <div className={`bg-white p-8 rounded-md shadow-md w-full max-w-lg ${className}`}>{children}</div>;
};
