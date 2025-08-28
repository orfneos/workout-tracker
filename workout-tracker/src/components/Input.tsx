import React, { ChangeEvent } from 'react';
import { cn } from '../lib/utils';

interface InputProps {
    name: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    min?: number | string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const Input = ({
                   name,
                   value,
                   onChange,
                   placeholder,
                   type = 'text',
                   min,
                   required = false,
                   disabled = false,
                   className = '',
                   style
               }: InputProps) => {
    const baseClasses = 'p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';

    return (
        <input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            min={min}
            required={required}
            disabled={disabled}
            className={cn(baseClasses, className)}
            style={style}
        />
    );
};

export default Input;