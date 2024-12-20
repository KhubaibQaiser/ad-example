import { FormField, FormInput, FormSvgInputInput, Label } from '@/components';
import { UseFormReturn } from 'react-hook-form';
import { AdFormSchema, templateRequiresMeta } from './form';

export function MetaFields({ form, isSubmitting }: { form: UseFormReturn<AdFormSchema>; isSubmitting: boolean }) {
  const [selectedTemplates] = form.watch(['templates']);

  return !templateRequiresMeta(selectedTemplates) ? null : (
    <section className='border-t pt-6 !mt-6 border-dashed'>
      <Label size='xl' className='text-center block'>
        Meta
      </Label>
      <div className='flex flex-col gap-3 mt-2'>
        <FormField
          control={form.control}
          name='meta.logo'
          render={({ field }) => <FormSvgInputInput {...field} label='Logo' disabled={isSubmitting} />}
        />
        <FormField
          control={form.control}
          name='meta.subTitle'
          render={({ field }) => <FormInput {...field} label='Subtitle' disabled={isSubmitting} />}
        />
        <FormField
          control={form.control}
          name='meta.footerText'
          render={({ field }) => <FormInput {...field} label='Footer Text' disabled={isSubmitting} />}
        />
      </div>
    </section>
  );
}
