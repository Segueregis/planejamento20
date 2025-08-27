
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  withDot = false,
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors";
  
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-status-operational text-white",
    warning: "bg-status-maintenance text-white",
    danger: "bg-status-warning text-white",
    info: "bg-primary text-primary-foreground",
    outline: "bg-transparent border border-current text-muted-foreground",
  };
  
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        withDot && "gap-1",
        className
      )}
    >
      {withDot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          variant === 'default' && "bg-muted-foreground",
          variant === 'success' && "bg-white",
          variant === 'warning' && "bg-white",
          variant === 'danger' && "bg-white",
          variant === 'info' && "bg-white",
          variant === 'outline' && "bg-current",
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;
