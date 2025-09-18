'use client';

import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';

interface TableDateFilterProps {
  title?: string;
  value?: Date | Date[] | { from: Date; to: Date };
  mode?: 'single' | 'multiple' | 'range';
  onValueChange?: (value: Date | Date[] | { from: Date; to: Date } | undefined) => void;
}

// Type guards
const isDateRange = (value: any): value is { from: Date; to: Date } => {
  return value && typeof value === 'object' && 'from' in value && 'to' in value;
};

const isDateArray = (value: any): value is Date[] => {
  return Array.isArray(value) && value.every(item => item instanceof Date);
};

const isSingleDate = (value: any): value is Date => {
  return value instanceof Date;
};

export function TableDateFilter({
  title,
  value,
  onValueChange,
  mode = 'single',
}: TableDateFilterProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal value with external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatDateValue = () => {
    if (!internalValue) return '';

    if (mode === 'single' && isSingleDate(internalValue)) {
      return format(internalValue, 'PPP');
    }

    if (mode === 'multiple' && isDateArray(internalValue)) {
      if (internalValue.length === 0) return '';
      if (internalValue.length === 1) return format(internalValue[0], 'PPP');
      return `${internalValue.length} dates selected`;
    }

    if (mode === 'range' && isDateRange(internalValue)) {
      if (internalValue.from && internalValue.to) {
        return `${format(internalValue.from, 'MMM d')} - ${format(internalValue.to, 'MMM d, yyyy')}`;
      }
      if (internalValue.from) {
        return `From ${format(internalValue.from, 'MMM d, yyyy')}`;
      }
      if (internalValue.to) {
        return `Until ${format(internalValue.to, 'MMM d, yyyy')}`;
      }
    }

    return '';
  };

  const hasValue = () => {
    if (!internalValue) return false;

    if (mode === 'single') {
      return isSingleDate(internalValue);
    }

    if (mode === 'multiple') {
      return isDateArray(internalValue) && internalValue.length > 0;
    }

    if (mode === 'range') {
      return isDateRange(internalValue) && (internalValue.from || internalValue.to);
    }

    return false;
  };

  const handleValueChange = (newValue: Date | Date[] | { from: Date; to: Date } | undefined) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValue(undefined);
    onValueChange?.(undefined);
    setIsOpen(false);
  };

  // Render the appropriate calendar based on mode
  const renderCalendar = () => {
    switch (mode) {
      case 'multiple':
        return (
          <Calendar
            mode="multiple"
            selected={isDateArray(internalValue) ? internalValue : undefined}
            onSelect={value => handleValueChange(value as Date[])}
            initialFocus
          />
        );
      case 'range':
        return (
          <Calendar
            mode="range"
            selected={isDateRange(internalValue) ? internalValue : undefined}
            onSelect={value => handleValueChange(value as { from: Date; to: Date })}
            initialFocus
            numberOfMonths={2}
          />
        );
      default:
        return (
          <Calendar
            mode="single"
            selected={isSingleDate(internalValue) ? internalValue : undefined}
            onSelect={value => handleValueChange(value as Date)}
            initialFocus
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {title && <Label className="text-sm font-medium text-gray-700">{title}</Label>}{' '}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'group relative h-8 justify-start border-dashed text-left font-normal',
              !hasValue() && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{hasValue() ? formatDateValue() : title}</span>
            {hasValue() && (
              <div className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-70" onClick={handleClear}>
                <X className="h-3 w-3" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {renderCalendar()}
          {hasValue() && (
            <div className="flex justify-end border-t p-2">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
