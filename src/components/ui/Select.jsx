import React, { forwardRef } from 'react';

const Select = forwardRef(({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                ref={ref}
                className={`
          block w-full rounded-lg shadow-sm transition-colors duration-200
          ${error
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
          ${props.disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
        `}
                {...props}
            >
                {props.placeholder && (
                    <option value="" disabled>{props.placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;