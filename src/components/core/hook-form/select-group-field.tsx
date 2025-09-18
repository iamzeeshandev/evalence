import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectFieldProps, SelectOption } from './select-field';

export interface NestedOption {
  value: string;
  label: string;
  children?: NestedOption[];
  isGradeRequired?: boolean;
  is_grade_required?: boolean;
}

interface NestedSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  options: NestedOption[];
  required?: boolean;
}
export const findSelectedOptionObject = (
  value: string,
  items: NestedOption[],
): NestedOption | undefined => {
  for (const item of items) {
    if (item.value === value) {
      return item;
    }
    if (item.children) {
      const found = findSelectedOptionObject(value, item.children);
      if (found) return found;
    }
  }
  return undefined;
};

export function NestedSelectField({
  name,
  label,
  placeholder,
  description,
  options,
  className,
  containerClassName,
  disabled,
  required,
  onValueChange,
}: NestedSelectFieldProps) {
  const { control } = useFormContext();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Function to find the selected option label
  const findSelectedOptionLabel = (value: string, items: NestedOption[]): string | undefined => {
    for (const item of items) {
      if (item.value === value) {
        return item.label;
      }
      if (item.children) {
        const found = findSelectedOptionLabel(value, item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const findSelectedOptionValue = (value: string, items: NestedOption[]): string | undefined => {
    for (const item of items) {
      if (item.value === value) {
        return item.value;
      }
      if (item.children) {
        const found = findSelectedOptionValue(value, item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const isValidOption = (value: string, items: NestedOption[]): boolean => {
    for (const item of items) {
      if (item.value === value) {
        return true;
      }
      if (item.children) {
        const found = isValidOption(value, item.children);
        if (found) return true;
      }
    }
    return false;
  };

  const toggleItem = (value: string) => {
    setOpenItems(prev => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const renderOptions = (items: NestedOption[], level = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.value];

      return (
        <div key={item.value} className="w-full">
          {hasChildren ? (
            <>
              <div
                className={`flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${level > 0 ? 'pl-8' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  toggleItem(item.value);
                }}
              >
                <span className="mr-2">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                {item.label}
              </div>
              {isOpen && (
                <div className="w-full">{renderOptions(item.children || [], level + 1)}</div>
              )}
            </>
          ) : (
            <SelectItem value={String(item.value)} className={`${level > 0 ? 'pl-8' : ''}`}>
              {item.label}
            </SelectItem>
          )}
        </div>
      );
    });
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedLabel = field.value
          ? findSelectedOptionLabel(field.value, options)
          : undefined;

        const isValid = field.value ? isValidOption(field.value, options) : false;
        return (
          <FormItem className={cn('space-y-0.5', containerClassName)}>
            {label && (
              <FormLabel>
                {label} {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <Select
              onValueChange={value => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              // value={selectedValue}
              value={isValid ? field.value : undefined}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={cn('w-full', className)}>
                  <SelectValue placeholder={placeholder}>
                    {selectedLabel || placeholder}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 overflow-y-auto">
                {renderOptions(options)}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

interface SelectGroupFieldProps extends Omit<SelectFieldProps, 'options'> {
  groups: SelectGroupOption[];
}

export function SelectGroupField({
  name,
  label,
  placeholder,
  description,
  groups,
  className,
  containerClassName,
  disabled,
  onValueChange,
}: SelectGroupFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('space-y-0.5', containerClassName)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={value => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn('w-full', className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {groups.map(group => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map(option => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
