'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export interface InputFieldProps {
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'time';
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  description?: ReactNode;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function InputField({
  name,
  label,
  description,
  type = 'text',
  className,
  containerClassName,
  required,
  disabled = false,
  leadingIcon,
  trailingIcon,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('space-y-0.5', containerClassName)}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className='relative'>
              {leadingIcon && (
                <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  {leadingIcon}
                </div>
              )}
              <Input
                {...field}
                type={type}
                className={cn(className, leadingIcon && 'pl-10', trailingIcon && 'pr-10')}
                value={field.value ?? ''}
                onChange={e => {
                  if (type === 'number') {
                    field.onChange(e.target.value === '' ? null : Number(e.target.value));
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                disabled={disabled}
                {...props}
              />
              {trailingIcon && (
                <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                  {trailingIcon}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
