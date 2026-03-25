import React from 'react';

const Card = ({ children, className = '', padding = 'normal', shadow = 'sm' }) => {
    const paddings = {
        none: '',
        small: 'p-4',
        normal: 'p-6',
        large: 'p-8'
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 ${shadows[shadow]} ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
};

export default Card;