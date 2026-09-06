'use client';

import * as React from 'react';
import { X } from 'lucide-react';

interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextValue | undefined>(undefined);

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open: controlledOpen, onOpenChange, children }: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <ModalContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </ModalContext.Provider>
  );
}

export function ModalTrigger({
  asChild = false,
  children,
  className = '',
  ...props
}: {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const context = React.useContext(ModalContext);
  const handleClick = () => context?.onOpenChange(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}

export function ModalContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(ModalContext);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && context?.open) {
        context.onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [context]);

  React.useEffect(() => {
    if (context?.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [context?.open]);

  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => context.onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-50 w-full max-w-lg rounded-2xl border border-brand-200 bg-white p-6 shadow-xl dark:border-brand-800 dark:bg-brand-900 animate-slide-up max-h-[90vh] overflow-y-auto ${className}`}
      >
        <button
          type="button"
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-brand-400 hover:text-brand-700 hover:bg-brand-100 dark:text-brand-500 dark:hover:text-brand-200 dark:hover:bg-brand-800 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 mb-4 text-left ${className}`} {...props} />;
}

export function ModalTitle({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-heading text-xl font-bold text-brand-900 dark:text-brand-100 ${className}`}
      {...props}
    />
  );
}

export function ModalDescription({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`font-body text-sm text-brand-600 dark:text-brand-400 ${className}`}
      {...props}
    />
  );
}

export function ModalFooter({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 ${className}`}
      {...props}
    />
  );
}

