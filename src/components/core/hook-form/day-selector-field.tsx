'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

export const DAYS = [
  { value: 'monday', shortLabel: 'Mon' },
  { value: 'tuesday', shortLabel: 'Tue' },
  { value: 'wednesday', shortLabel: 'Wed' },
  { value: 'thursday', shortLabel: 'Thu' },
  { value: 'friday', shortLabel: 'Fri' },
  { value: 'saturday', shortLabel: 'Sat' },
  { value: 'sunday', shortLabel: 'Sun' },
] as const;

interface DaySelectorFieldProps {
  name: string;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  dayClassName?: string;
  selectedDayClassName?: string;
  onDaysChange?: (selectedDays: string[]) => void;
}

export function DaySelectorField({
  name,
  label,
  direction = 'horizontal',
  className,
  dayClassName,
  selectedDayClassName,
  onDaysChange,
}: DaySelectorFieldProps) {
  const formContext = useFormContext();
  const formControl = formContext.control;

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className={cn('flex justify-center gap-2', {
                'flex-row': direction === 'horizontal',
                'flex-col': direction === 'vertical',
              })}
            >
              {DAYS.map(day => {
                // const isSelected = field.value?.some((d: { day: string }) => d.day === day.value);
                const dayItem = field.value?.find((d: { day: string }) => d.day === day.value);
                const isSelected = dayItem?.isAvailable;
                return (
                  <button
                    key={day.value}
                    type="button"
                    className={cn(
                      'h-10 w-28 rounded-sm border text-sm font-medium transition-colors',
                      'flex items-center justify-center',
                      'focus-visible:ring-ring hover:bg-gray-100 focus-visible:ring-2 focus-visible:outline-none',
                      dayClassName,
                      isSelected
                        ? cn(
                            'bg-primary text-primary-foreground hover:bg-primary/90',
                            selectedDayClassName,
                          )
                        : 'bg-muted text-muted-foreground',
                    )}
                    // onClick={() => {
                    //   const newValue = isSelected
                    //     ? field.value.filter((d: { day: string }) => d.day !== day.value)
                    //     : [
                    //         ...(field.value || []),
                    //         { day: day.value, shiftType: '', isAvailable: true },
                    //       ];

                    //   field.onChange(newValue);
                    //   onDaysChange?.(newValue.map((d: { day: string }) => d.day));
                    // }}
                    onClick={() => {
                      const newValue = field.value.map((d: { day: string, isAvailable: boolean }) =>
                        d.day === day.value ? { ...d, isAvailable: !d.isAvailable } : d,
                      );
                      field.onChange(newValue);
                      onDaysChange?.(newValue
                        .filter((d: { isAvailable: boolean }) => d.isAvailable)
                        .map((d: { day: string }) => d.day));
                     
                    }}
                  >
                    {day.shortLabel}
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===========================

// const SHIFT_TYPES = [
//   { value: 'long_day', label: 'Full Day' },
//   { value: 'short_day', label: 'Half Day' },
//   { value: 'night', label: 'Night' },
//   { value: 'unavailable', label: 'Unavailable' },
// ] as const;

// interface DayShiftSelectorProps {
//   name: string;
//   className?: string;
// }

// export function DayShiftSelector({ name, className }: DayShiftSelectorProps) {
//   const { control, watch, setValue } = useFormContext();
//   const currentValues = watch(name) || {};

//   const handleDayClick = (day: string) => {
//     const newValues = { ...currentValues };
//     if (newValues[day]) {
//       // Cycle through shift types
//       const currentIndex = SHIFT_TYPES.findIndex(st => st.value === newValues[day]);
//       const nextIndex = (currentIndex + 1) % SHIFT_TYPES.length;
//       newValues[day] = SHIFT_TYPES[nextIndex].value;
//     } else {
//       // Set to first shift type
//       newValues[day] = SHIFT_TYPES[0].value;
//     }
//     setValue(name, newValues, { shouldValidate: true });
//   };

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className={className}>
//           <FormControl>
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-2">
//                 {DAYS.map(day => {
//                   const shiftType = currentValues[day.value];
//                   const isSelected = !!shiftType && shiftType !== 'unavailable';
//                   const shiftLabel = SHIFT_TYPES.find(st => st.value === shiftType)?.label;

//                   return (
//                     <div key={day.value} className="flex flex-col items-center gap-1">
//                       <button
//                         type="button"
//                         className={cn(
//                           'flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 transition-all',
//                           'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
//                           isSelected
//                             ? 'border-primary bg-primary/10'
//                             : shiftType === 'unavailable'
//                               ? 'border-destructive/30 bg-destructive/5'
//                               : 'border-muted bg-muted/10',
//                         )}
//                         onClick={() => handleDayClick(day.value)}
//                       >
//                         <span
//                           className={cn(
//                             'text-sm font-medium',
//                             isSelected
//                               ? 'text-primary'
//                               : shiftType === 'unavailable'
//                                 ? 'text-destructive/70'
//                                 : 'text-muted-foreground',
//                           )}
//                         >
//                           {day.shortLabel}
//                         </span>
//                         {shiftType && (
//                           <span
//                             className={cn(
//                               'mt-0.5 text-xs',
//                               isSelected
//                                 ? 'text-primary'
//                                 : shiftType === 'unavailable'
//                                   ? 'text-destructive/70'
//                                   : 'text-muted-foreground',
//                             )}
//                           >
//                             {shiftLabel?.charAt(0)}
//                           </span>
//                         )}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(currentValues)
//                   .filter(([_, shiftType]) => shiftType && shiftType !== 'unavailable')
//                   .map(([day, shiftType]) => (
//                     <div key={day} className="flex items-center gap-3">
//                       <div className="w-24">
//                         <span className="text-sm font-medium capitalize">
//                           {DAYS.find(d => d.value === day)?.shortLabel}
//                         </span>
//                       </div>
//                       <Select
//                         value={shiftType}
//                         onValueChange={value => {
//                           const newValues = { ...currentValues };
//                           newValues[day] = value;
//                           setValue(name, newValues, { shouldValidate: true });
//                         }}
//                       >
//                         <SelectTrigger className="w-[180px]">
//                           <SelectValue placeholder="Select shift" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {SHIFT_TYPES.filter(st => st.value !== 'unavailable').map(st => (
//                             <SelectItem key={st.value} value={st.value}>
//                               {st.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
