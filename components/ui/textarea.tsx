import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, errorMessage, ...props }, ref) => {
    const errorId = error && errorMessage ? `${props.id || 'textarea'}-error` : undefined
    
    return (
      <textarea
        className={`flex min-h-[100px] sm:min-h-[80px] w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-4 sm:px-3 py-3 sm:py-2 text-base sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-600'
        } focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation resize-y ${className}`}
        ref={ref}
        aria-invalid={error}
        aria-describedby={errorId}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
