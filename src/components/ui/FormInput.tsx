import React from 'react';

export interface FormInputProps {
  id?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  fontFamily?: 'default' | 'monospace';
  fontSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  rows = 4,
  fontFamily = 'default',
  fontSize = 'medium',
  className = ''
}) => {
  const inputGroupStyles = {
    marginBottom: '20px'
  };

  const labelStyles = {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  };

  const baseInputStyles = {
    width: '100%',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box' as const,
    ...(disabled ? { opacity: 0.6 } : {})
  };

  const sizeStyles = {
    small: { padding: '8px 12px', fontSize: '0.75rem' },
    medium: { padding: '12px 16px', fontSize: '1rem' },
    large: { padding: '16px 20px', fontSize: '1.125rem' }
  };

  const fontStyles = {
    default: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    monospace: { fontFamily: 'Monaco, Consolas, "Lucida Console", monospace', lineHeight: '1.4' }
  };

  const inputStyles = {
    ...baseInputStyles,
    ...sizeStyles[fontSize],
    ...fontStyles[fontFamily]
  };

  const textareaStyles = {
    ...inputStyles,
    minHeight: type === 'textarea' ? `${Math.max(rows * 24, 100)}px` : undefined,
    resize: 'vertical' as const
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={inputGroupStyles} className={className}>
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          rows={rows}
          style={textareaStyles}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          style={inputStyles}
        />
      )}
    </div>
  );
}; 