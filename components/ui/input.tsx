import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, errorMessage, ...props }, ref) => {
    const errorId = error && errorMessage ? `${props.id || 'input'}-error` : undefined
    
    return (
      <input
        className={`flex h-11 sm:h-10 w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-4 sm:px-3 py-3 sm:py-2 text-base sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-600'
        } focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation ${className}`}
        ref={ref}
        aria-invalid={error}
        aria-describedby={errorId}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
