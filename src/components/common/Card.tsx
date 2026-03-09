import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-2xl p-4',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
