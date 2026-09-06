import * as React from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className = '',
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-200 p-8 text-center animate-in fade-in-50 dark:border-brand-800 ${className}`}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900 dark:text-brand-400">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-heading font-semibold text-brand-900 dark:text-brand-50">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm font-body text-brand-500 dark:text-brand-400">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
