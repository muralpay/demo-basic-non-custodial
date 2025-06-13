import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  href,
  target,
  rel
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    outline: 'none',
    ...(disabled || loading ? { opacity: 0.6 } : {})
  };

  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '0.875rem' },
    medium: { padding: '12px 24px', fontSize: '1rem' },
    large: { padding: '16px 32px', fontSize: '1.125rem' }
  };

  const variantStyles = {
    primary: { backgroundColor: '#3b82f6', color: 'white' },
    secondary: { backgroundColor: '#6b7280', color: 'white' },
    success: { backgroundColor: '#10b981', color: 'white' },
    danger: { backgroundColor: '#ef4444', color: 'white' }
  };

  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        style={styles}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={styles}
    >
      {loading ? '🔄 Loading...' : children}
    </button>
  );
}; 