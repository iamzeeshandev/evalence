'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export interface SwitchFieldProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  formItemClassName?: string;
  formDescriptionClassName?: string;
}

export function SwitchField({
  name,
  label,
  description,
  className,
  containerClassName,
  required,
  disabled = false,
  formItemClassName,
  formDescriptionClassName,
}: SwitchFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-center justify-between rounded-lg border p-4',
            formItemClassName,
            containerClassName,
          )}
        >
          <div className="space-y-0.5">
            {label && (
              <FormLabel>
                {label} {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            {description && (
              <FormDescription className={formDescriptionClassName}>{description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
