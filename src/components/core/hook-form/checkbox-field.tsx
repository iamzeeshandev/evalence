'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface CheckboxOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
  options: CheckboxOption[];
  direction?: 'vertical' | 'horizontal';
  required?: boolean;
  className?: string;
}

export function CheckboxField({
  name,
  label,
  description,
  options,
  direction = 'vertical',
  className,
}: CheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem className={className}>
          {(label || description) && (
            <div className="mb-2">
              {label && <FormLabel>{label}</FormLabel>}
              {description && <FormDescription>{description}</FormDescription>}
            </div>
          )}
          <div className={cn('space-y-2', direction === 'horizontal' && 'flex flex-wrap gap-4')}>
            {options.map(option => (
              <FormField
                key={option.id}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className={cn(
                        'flex flex-row items-center gap-2',
                        direction === 'horizontal' && 'min-w-[150px] flex-1',
                      )}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={checked => {
                            return checked
                              ? field.onChange([...(field.value || []), option.id])
                              : field?.onChange(
                                  field.value?.filter((value: string) => value !== option.id),
                                );
                          }}
                          disabled={option.disabled}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer text-sm font-normal">
                          {option.label}
                        </FormLabel>
                        {option.description && (
                          <FormDescription className="text-xs">
                            {option.description}
                          </FormDescription>
                        )}
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
