'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string | ReactNode;
  disabled?: boolean;
  [key: string]: string | boolean | ReactNode;
}

export interface SelectFieldProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  options: SelectOption[];
  className?: string;
  containerClassName?: string;
  formMessageClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  layout?: 'row' | 'column';
  labelWidth?: string;
  required?: boolean;
  getOptionClassName?: (option: SelectOption) => string;
}

export function SelectField({
  name,
  label,
  placeholder,
  description,
  options,
  className,
  containerClassName,
  formMessageClassName,
  disabled,
  onValueChange,
  getOptionClassName,
  layout = 'column',
  labelWidth = 'w-32',
  required,
}: SelectFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            {
              'flex flex-col space-y-0.5': layout === 'column',
              'flex flex-row items-center gap-3': layout === 'row',
            },
            containerClassName,
          )}
        >
          {label && (
            <FormLabel
              className={cn(
                {
                  [labelWidth]: layout === 'row',
                },
                'shrink-0',
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={value => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  'w-full',
                  {
                    'cursor-not-allowed border-gray-300': disabled,
                  },
                  className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                  className={cn(getOptionClassName?.(option))}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={cn(formMessageClassName)} />
        </FormItem>
      )}
    />
  );
}
