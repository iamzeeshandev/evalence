"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

export interface InputFieldProps {
  name: string;
  label?: ReactNode;
  className?: string;
  description?: ReactNode;
  containerClassName?: string;
  placeholder: string;
  required?: boolean;
  onBlur?: () => void;
}

export function TextareaField({
  name,
  label,
  description,
  className,
  containerClassName,
  placeholder,
  required,
  onBlur,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", containerClassName)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="h-[80px] resize-none"
              {...field}
              {...props}
              onBlur={onBlur}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
