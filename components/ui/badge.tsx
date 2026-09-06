import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-brand-950';
  
  const variants = {
    default: 'border-transparent bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600',
    secondary: 'border-transparent bg-brand-100 text-brand-900 hover:bg-brand-200 dark:bg-brand-800 dark:text-brand-50 dark:hover:bg-brand-700',
    success: 'border-transparent bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-800',
    warning: 'border-transparent bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-50 dark:hover:bg-yellow-800',
    error: 'border-transparent bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-800',
    outline: 'text-brand-900 dark:text-brand-50 border-brand-200 dark:border-brand-800',
  };

  const variantStyles = variants[variant];

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
  );
}

export { Badge };
