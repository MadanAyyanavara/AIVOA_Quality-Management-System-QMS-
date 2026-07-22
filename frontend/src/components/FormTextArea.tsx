import React from 'react';
import { getPlaceholder } from '../utils/formHelpers';

interface FormTextAreaProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  helpText?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  error,
  helpText,
}) => {
  const baseClass =
    'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-inter resize-vertical';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder(value, placeholder)}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${baseClass} ${
          !value ? 'opacity-50' : 'opacity-100'
        } transition-opacity ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormTextArea;
