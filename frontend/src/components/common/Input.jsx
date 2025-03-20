import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  label,
  required = false,
  error = '',
  className = '',
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        required={required}
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export default Input; 