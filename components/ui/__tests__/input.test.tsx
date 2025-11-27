import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  it('should render input field', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument()
  })

  it('should handle text input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText(/type here/i)
    await user.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('should apply error styles when error prop is true', () => {
    render(<Input error placeholder="Error input" />)
    const input = screen.getByPlaceholderText(/error input/i)
    expect(input).toHaveClass('border-red-500')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should display error message with aria-describedby', () => {
    render(<Input id="email" error errorMessage="Invalid email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText(/disabled/i)
    expect(input).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />)
    expect(screen.getByPlaceholderText(/custom/i)).toHaveClass('custom-input')
  })

  it('should forward ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should handle onChange event', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    expect(handleChange).toHaveBeenCalled()
  })

  it('should support different input types', () => {
    const { container, rerender } = render(<Input type="email" />)
    let input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
  })
})
