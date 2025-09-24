import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva('cursor-pointer', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      success: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600',
      ghost:
        'bg-white shadow-none text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      'outline-primary': 'border border-primary text-primary hover:bg-primary/10',
      'outline-secondary': 'border border-secondary text-secondary hover:bg-secondary/10',
      'outline-success': 'border border-green-500 text-green-500 hover:bg-green-50',
      'outline-warning': 'border border-yellow-500 text-yellow-500 hover:bg-yellow-50',
      'outline-danger': 'border border-red-500 text-red-500 hover:bg-red-50',
      'outline-info': 'border border-blue-500 text-blue-500 hover:bg-blue-50',
      outline:
        'border bg-background pointer shadow-xs text-black hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
      link: 'underline-offset-4 hover:underline text-primary',
      icon: 'bg-transparent text-primary-foreground hover:bg-transparent !h-auto !p-0',
    },
    size: {
      sm: 'h-9 px-4 text-xs',
      md: 'h-10 py-2 px-4',
      lg: 'h-11 px-8 text-md',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
  };

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  trailingIcon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      className={cn(buttonVariants({ variant, size }), className, { 'w-full': fullWidth })}
      disabled={loading}
      {...props}
    >
      {icon && <span className={cn({ 'mr-2': children })}>{icon}</span>}
      {children}
      {trailingIcon && <span className={cn({ 'ml-2': children })}>{trailingIcon}</span>}
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    </ShadcnButton>
  );
}
