"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  onValueChange?: (value: string | string[]) => void;
  layout?: "row" | "column";
  labelWidth?: string;
  required?: boolean;
  getOptionClassName?: (option: SelectOption) => string;
  multiple?: boolean;
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
  layout = "column",
  labelWidth = "w-32",
  required,
  multiple = false,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  const handleMultiSelectChange = (value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    return newValues;
  };

  const removeValue = (
    valueToRemove: string,
    currentValues: string[],
    onChange: (values: string[]) => void
  ) => {
    const newValues = currentValues.filter((v) => v !== valueToRemove);
    onChange(newValues);
    onValueChange?.(newValues);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            {
              "flex flex-col space-y-0.5": layout === "column",
              "flex flex-row items-center gap-3": layout === "row",
            },
            containerClassName
          )}
        >
          {label && (
            <FormLabel
              className={cn(
                {
                  [labelWidth]: layout === "row",
                },
                "shrink-0"
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}

          {multiple ? (
            <div className="space-y-2">
              {/* Multi-select dropdown */}
              <Select
                onValueChange={(value) => {
                  const newValues = handleMultiSelectChange(
                    value,
                    field.value || []
                  );
                  field.onChange(newValues);
                  onValueChange?.(newValues);
                }}
                value=""
                disabled={disabled}
                open={open}
                onOpenChange={setOpen}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      {
                        "cursor-not-allowed border-gray-300": disabled,
                      },
                      className
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options
                    .filter((option) => !field.value?.includes(option.value))
                    .map((option) => (
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
              {/* Display Selected values as badges */}
              {Array.isArray(field.value) && field.value.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {field.value.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {option?.label || value}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() =>
                            removeValue(value, field.value, field.onChange)
                          }
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              value={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-full",
                    {
                      "cursor-not-allowed border-gray-300": disabled,
                    },
                    className
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
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
          )}

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={cn(formMessageClassName)} />
        </FormItem>
      )}
    />
  );
}
