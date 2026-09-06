import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, children, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-brand-900 dark:text-brand-100">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={`flex h-10 w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-brand-800 dark:bg-brand-900 dark:text-brand-50 dark:ring-offset-brand-950 ${
              error ? 'border-red-500 focus-visible:ring-red-500' : 'border-brand-200'
            } ${className}`}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-brand-500 opacity-50" />
        </div>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
