'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';

interface TableSelectFilterProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

export function TableSelectFilter({
  title,
  options,
  value,
  onChange,
  className,
  placeholder = 'Select an option...',
}: TableSelectFilterProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="flex flex-col gap-1">
      {title && <Label className="text-sm font-medium text-gray-700">{title}</Label>}{' '}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn('h-8 justify-between', className)}>
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            {title && <CommandInput placeholder={title} />}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange?.(option.value === value ? undefined : option.value);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                      )}
                      <span>{option.label}</span>
                      {option.value === value && <Check className="text-primary ml-auto h-4 w-4" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
