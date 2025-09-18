'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface BaseDatePickerProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  disablePastDates?: boolean;
}

interface DatePickerFieldProps extends BaseDatePickerProps {
  mode?: 'single';
}

interface DateRangePickerFieldProps extends BaseDatePickerProps {
  mode: 'range';
}

interface DateMultiplePickerFieldProps extends BaseDatePickerProps {
  mode: 'multiple';
  maxDates?: number;
}

type Props = DatePickerFieldProps | DateRangePickerFieldProps | DateMultiplePickerFieldProps;

export function DatePickerField(props: Props) {
  if (props.mode === 'range') {
    return <DateRangePickerField {...props} />;
  }
  if (props.mode === 'multiple') {
    return <MultipleDatePickerField {...props} />;
  }
  return <SingleDatePickerField {...props} />;
}

function SingleDatePickerField({
  name,
  label,
  description,
  className,
  required = false,
  disablePastDates = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col space-y-0.5', className)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? format(field.value, 'PPP') : <span>DD-MM-YYYY</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={field.value}
                onSelect={date => {
                  if (!date) return;
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={
                  disablePastDates
                    ? date => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }
                    : undefined
                }
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DateRangePickerField({
  name,
  label,
  description,
  className,
  required = false,
  disablePastDates = false,
  placeholder = 'Select date range',
}: DateRangePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as { from?: Date; to?: Date } | undefined;
        const from = value?.from;
        const to = value?.to;

        const displayText =
          from && to
            ? `${format(from, 'MMM d')} - ${format(to, 'MMM d, yyyy')}`
            : from
              ? `From ${format(from, 'MMM d, yyyy')}`
              : to
                ? `Until ${format(to, 'MMM d, yyyy')}`
                : placeholder;

        return (
          <FormItem className={cn('flex flex-col space-y-0.5', className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <Popover modal={true} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !value && 'text-muted-foreground',
                    )}
                  >
                    {displayText}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{ from, to }}
                  onSelect={range => {
                    if (!range) return;

                    // Only close when both dates are selected for better UX
                    if (range.from && range.to) {
                      field.onChange(range);
                      setOpen(false);
                    } else if (range.from) {
                      // Update with partial range
                      field.onChange({ from: range.from, to: undefined });
                    }
                  }}
                  disabled={
                    disablePastDates
                      ? date => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }
                      : undefined
                  }
                  captionLayout="dropdown"
                  numberOfMonths={2}
                />
                {(from || to) && (
                  <div className="flex justify-end border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        field.onChange({ from: undefined, to: undefined });
                        setOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function MultipleDatePickerField({
  name,
  label,
  description,
  className,
  required = false,
  disablePastDates = false,
  placeholder = 'Select multiple dates',
  maxDates,
}: DateMultiplePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDates = (field.value as Date[]) || [];

        const displayText =
          selectedDates.length > 0
            ? `${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''} selected`
            : placeholder;

        const removeDate = (dateToRemove: Date) => {
          const updatedDates = selectedDates.filter(
            date => date.getTime() !== dateToRemove.getTime(),
          );
          field.onChange(updatedDates);
        };

        const clearAllDates = () => {
          field.onChange([]);
        };

        return (
          <FormItem className={cn('flex flex-col space-y-0.5', className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <Popover modal={true} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      selectedDates.length === 0 && 'text-muted-foreground',
                    )}
                  >
                    {displayText}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={dates => {
                    if (!dates) return;

                    // Handle max dates limit
                    let finalDates = dates;
                    if (maxDates && dates.length > maxDates) {
                      finalDates = dates.slice(0, maxDates);
                    }

                    field.onChange(finalDates);

                    // Close popover if max dates reached
                    if (maxDates && finalDates.length >= maxDates) {
                      setOpen(false);
                    }
                  }}
                  disabled={
                    disablePastDates
                      ? date => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }
                      : undefined
                  }
                  captionLayout="dropdown"
                />

                {maxDates && (
                  <div className="text-muted-foreground border-t p-2 text-sm">
                    {selectedDates.length}/{maxDates} dates selected
                  </div>
                )}

                {selectedDates.length > 0 && (
                  <div className="flex justify-end border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        field.onChange([]);
                        setOpen(false);
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Selected dates chips */}
            {selectedDates.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className="bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                  >
                    <span>{format(date, 'MMM d, yyyy')}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground h-4 w-4 p-0"
                      onClick={() => removeDate(date)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearAllDates}
                >
                  Clear all
                </Button>
              </div>
            )}

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
