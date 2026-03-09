import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-textSecondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full px-4 py-3 bg-surface border border-border rounded-xl',
            'text-textPrimary placeholder:text-textTertiary',
            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
            'transition-all duration-200',
            icon && 'pl-12',
            error && 'border-error',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
};
