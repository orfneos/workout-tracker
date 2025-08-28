import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

/**
 * Reusable button component with loading states and multiple style variants
 * Uses clsx or cn utility for conditional class merging
 */
const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    loading = false,
                    className = ''
                }: ButtonProps) => {
    const baseClasses = 'border-none rounded-md font-medium cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;