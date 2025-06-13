import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  className = ''
}) => {
  const labelStyles = {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  };

  const radioGroupStyles = {
    display: 'flex',
    gap: '20px',
    margin: '10px 0'
  };

  const radioOptionStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    minWidth: '120px',
    ...(disabled ? { opacity: 0.6 } : {})
  };

  const radioOptionSelectedStyles = {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    color: '#1d4ed8'
  };

  const radioInputStyles = {
    marginRight: '8px',
    accentColor: '#3b82f6'
  };

  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={radioGroupStyles}>
        {options.map((option) => (
          <label
            key={option.value}
            style={{
              ...radioOptionStyles,
              ...(value === option.value ? radioOptionSelectedStyles : {}),
              ...(option.disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
            onClick={() => handleChange(option.value)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || option.disabled}
              style={radioInputStyles}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}; 