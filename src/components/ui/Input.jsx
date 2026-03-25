import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helperText, icon: Icon, className = '', ...props }, ref) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            block w-full rounded-lg shadow-sm transition-colors duration-200
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
            ${props.disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;