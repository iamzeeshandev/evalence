'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
}

interface RadioGroupFieldProps {
  name: string;
  label?: string;
  description?: string;
  options: RadioOption[];
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export function RadioGroupField({
  name,
  label,
  description,
  options,
  direction = 'vertical',
  className,
}: RadioGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          {(label || description) && (
            <div>
              {label && <FormLabel className="text-base">{label}</FormLabel>}
              {description && <FormDescription>{description}</FormDescription>}
            </div>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn(direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col')}
            >
              {options.map(option => (
                <FormItem key={option.value} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={option.value} disabled={option.disabled} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer font-normal">{option.label}</FormLabel>
                    {option.description && (
                      <FormDescription className="text-xs">{option.description}</FormDescription>
                    )}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
