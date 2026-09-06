import * as React from 'react';

function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-brand-100 dark:bg-brand-800 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
