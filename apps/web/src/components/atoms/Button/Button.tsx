import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from './Button.props';
import { baseClasses, variantClasses, sizeClasses } from './Button.style';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  children,
  className,
  ...rest
}) => {
  const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {!loading && iconLeft && <span className="mr-1">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};
