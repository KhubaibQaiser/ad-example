import type * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export async function convertSvgToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = function (event: ProgressEvent<FileReader>) {
        if (event.target?.result) {
          const result = event.target.result as string;
          const base64String = result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert SVG to base64.'));
        }
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    } else {
      reject(new Error('Invalid file type. Please select an SVG file.'));
    }
  });
}

export async function readSvgFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = function (event: ProgressEvent<FileReader>) {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          resolve('');
        }
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsText(file);
    } else {
      reject(new Error('Invalid file type. Please select an SVG file.'));
    }
  });
}
