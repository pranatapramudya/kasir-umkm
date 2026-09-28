"use client";

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
  xl: 'px-8 py-4 text-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-blue-600 to-indigo-600 
    text-white 
    shadow-lg shadow-blue-600/30
    hover:from-blue-700 hover:to-indigo-700 
    hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5
    active:scale-[0.98]
    transition-all duration-200
  `,
  secondary: `
    bg-white dark:bg-slate-800 
    border-2 border-slate-300 dark:border-slate-600
    text-slate-900 dark:text-white
    shadow-sm
    hover:bg-slate-50 dark:hover:bg-slate-700
    hover:border-slate-400 dark:hover:border-slate-500
    hover:shadow-md
    active:scale-[0.98]
    transition-all duration-200
  `,
  outline: `
    bg-white dark:bg-transparent
    border border-slate-300 dark:border-slate-600
    text-slate-800 dark:text-slate-200
    hover:bg-slate-100 dark:hover:bg-slate-800/50
    hover:border-slate-400 dark:hover:border-slate-500
    transition-all duration-200
  `,
  ghost: `
    bg-transparent
    border-none
    text-slate-700 dark:text-slate-300
    hover:bg-slate-100 dark:hover:bg-slate-800/50
    hover:text-slate-900 dark:hover:text-slate-100
    transition-all duration-200
  `,
};

const baseClasses = `
  inline-flex items-center justify-center gap-2
  font-semibold rounded-xl
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
  whitespace-nowrap
`;

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  href,
  className = '',
  children,
  disabled,
  onClick,
}: ButtonProps) {
  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-5 h-5';

  const content = (
    <>
      {isLoading ? (
        <svg className={`animate-spin ${iconSize}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </>
  );

  const isAnchor = !!href;
  const isDisabled = disabled || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  const commonProps = {
    className: classes,
    'aria-disabled': isDisabled,
    tabIndex: isDisabled ? -1 : 0,
    onClick: handleClick,
  };

  if (isAnchor) {
    return (
      <a {...commonProps} href={href || '#'}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} type="button" disabled={isDisabled}>
      {content}
    </button>
  );
}

export default Button;