'use client';

import { ComponentPropsWithoutRef, createContext, ElementRef, forwardRef, HTMLAttributes, useContext, useId, useMemo } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Label, type Root as LabelRoot } from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { HelperText } from './helper-text';

type LabelProps = typeof LabelRoot;

type FormItemContextValue = {
  id: string;
};

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = useId();
  const idValue = useMemo(() => ({ id }), [id]);

  return (
    <FormItemContext.Provider value={idValue}>
      <div ref={ref} className={twMerge('space-y-1.5', className)} {...props} />
    </FormItemContext.Provider>
  );
});

export const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <HelperText ref={ref} id={formMessageId} className={twMerge('text-red-500 mt-1', className)} {...props}>
      {body}
    </HelperText>
  );
});

FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<ElementRef<LabelProps>, ComponentPropsWithoutRef<LabelProps>>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();

  return <Label ref={ref} className={className} htmlFor={formItemId} {...props} />;
});

FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

export function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  const nameValue = useMemo(() => ({ name: props.name }), [props.name]);
  return (
    <FormFieldContext.Provider value={nameValue}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}
