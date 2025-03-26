'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  animate?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'; 
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  animate = true,
  rounded = 'md',
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all focus:outline-none';
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-3',
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-primary-100 text-primary-800 hover:bg-primary-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-800 dark:text-primary-100 dark:hover:bg-primary-700',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 shadow-sm dark:bg-accent-600 dark:hover:bg-accent-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-neutral-800',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-400 dark:hover:bg-neutral-800',
  };
  
  // State classes
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Animation values
  const motionProps = animate ? {
    whileHover: { scale: disabled || loading ? 1 : 1.02 },
    whileTap: { scale: disabled || loading ? 1 : 0.98 },
    transition: { duration: 0.2, ease: [0.19, 1, 0.22, 1] }
  } : {};
  
  // Combine all classes
  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size],
    roundedClasses[rounded],
    variantClasses[variant],
    disabled || loading ? disabledClasses : '',
    widthClasses,
    className
  );
  
  // Button content
  const content = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="h-5 w-5 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      <span className={cn(
        "flex items-center", 
        loading ? 'invisible' : '',
        iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse'
      )}>
        {icon && <span className={cn(
          iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5',
          "inline-flex shrink-0"
        )}>{icon}</span>}
        {children}
      </span>
    </>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link 
          href={href} 
          className={combinedClasses}
          aria-disabled={disabled || loading}
          tabIndex={disabled || loading ? -1 : undefined}
        >
          {content}
        </Link>
      </motion.div>
    );
  }
  
  // Render as regular button
  return animate ? (
    <motion.button
      type="button"
      className={combinedClasses}
      disabled={disabled || loading}
      {...motionProps}
      // Filtern der Props, die mit HTMLMotionProps kompatibel sind
      onClick={props.onClick}
    >
      {content}
    </motion.button>
  ) : (
    <button
      type="button"
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}

// Composable Button Group
export const ButtonGroup = ({ 
  children, 
  className = '', 
  variant = 'horizontal',
  spacing = 'md'
}: { 
  children: ReactNode, 
  className?: string,
  variant?: 'horizontal' | 'vertical',
  spacing?: 'xs' | 'sm' | 'md' | 'lg'
}) => {
  const spacingClasses = {
    xs: variant === 'horizontal' ? 'space-x-1' : 'space-y-1',
    sm: variant === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: variant === 'horizontal' ? 'space-x-3' : 'space-y-3',
    lg: variant === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };

  return (
    <div className={cn(
      'flex',
      variant === 'horizontal' ? 'flex-row items-center' : 'flex-col items-start',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};