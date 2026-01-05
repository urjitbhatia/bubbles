import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'

  const variantClasses = {
    primary: 'px-6 py-3 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white shadow-sm hover:shadow-md',
    secondary: 'px-6 py-3 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-ocean-700 border-2 border-ocean-600 hover:border-ocean-700',
    ghost: 'px-4 py-2 bg-transparent hover:bg-ocean-50 active:bg-ocean-100 text-ocean-700',
    destructive: 'px-6 py-3 bg-error-600 hover:bg-error-700 active:bg-error-800 text-white shadow-sm hover:shadow-md'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${size !== 'md' ? sizeClasses[size] : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
