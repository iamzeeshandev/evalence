'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';

export interface NestedOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NestedOption[];
}

interface TableNestedSelectFilterProps {
  title?: string;
  options: NestedOption[];
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

export function TableNestedSelectFilter({
  title,
  options,
  value,
  onChange,
  className,
  placeholder = 'Select an option...',
}: TableNestedSelectFilterProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Find the selected option by traversing all nested options
  const findSelectedOption = (items: NestedOption[]): NestedOption | undefined => {
    for (const item of items) {
      if (item.value === value) return item;
      if (item.children) {
        const found = findSelectedOption(item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedOption = findSelectedOption(options);

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
      const isSelected = item.value === value;

      return (
        <div key={item.value}>
          <div
            className={cn(
              'flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm select-none',
              'hover:bg-accent hover:text-accent-foreground',
              isSelected && 'bg-accent font-medium',
            )}
            onClick={() => {
              if (hasChildren) {
                toggleItem(item.value);
              } else {
                onChange?.(item.value === value ? undefined : item.value);
              }
            }}
          >
            {hasChildren ? (
              <span className="mr-1">
                {isOpen ? (
                  <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
                )}
              </span>
            ) : (
              <span className="mr-1 w-4.5" /> // Spacer for alignment
            )}

            {item.icon && <item.icon className="text-muted-foreground mr-2 h-4 w-4" />}

            <span className="flex-1 truncate" style={{ marginLeft: level > 0 ? level * 12 : 0 }}>
              {item.label}
            </span>

            {isSelected && !hasChildren && <Check className="text-primary ml-auto h-4 w-4" />}
          </div>

          {hasChildren && isOpen && item.children && (
            <div className="ml-2">{renderOptions(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

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
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandGroup>{renderOptions(options)}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
