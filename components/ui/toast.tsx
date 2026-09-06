'use client';

import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-brand-950 group-[.toaster]:border-brand-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-brand-950 dark:group-[.toaster]:text-brand-50 dark:group-[.toaster]:border-brand-800 font-body',
          description: 'group-[.toast]:text-brand-500 dark:group-[.toast]:text-brand-400',
          actionButton:
            'group-[.toast]:bg-brand-900 group-[.toast]:text-brand-50 dark:group-[.toast]:bg-brand-50 dark:group-[.toast]:text-brand-900',
          cancelButton:
            'group-[.toast]:bg-brand-100 group-[.toast]:text-brand-500 dark:group-[.toast]:bg-brand-800 dark:group-[.toast]:text-brand-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast as showToast };
