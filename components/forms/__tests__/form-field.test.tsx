import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from '../form-field'
import { Input } from '@/components/ui/input'

describe('FormField Component', () => {
  it('should render children', () => {
    render(
      <FormField>
        <Input placeholder="Test input" />
      </FormField>
    )
    expect(screen.getByPlaceholderText(/test input/i)).toBeInTheDocument()
  })

  it('should render label when provided', () => {
    render(
      <FormField label="Email Address">
        <Input />
      </FormField>
    )
    expect(screen.getByText(/email address/i)).toBeInTheDocument()
  })

  it('should show required indicator when required is true', () => {
    render(
      <FormField label="Name" required>
        <Input />
      </FormField>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should display error message', () => {
    render(
      <FormField label="Email" error="Invalid email address">
        <Input />
      </FormField>
    )
    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent(/invalid email address/i)
  })

  it('should associate label with input using htmlFor', () => {
    render(
      <FormField label="Username" htmlFor="username-input">
        <Input id="username-input" />
      </FormField>
    )
    const label = screen.getByText(/username/i)
    expect(label).toHaveAttribute('for', 'username-input')
  })

  it('should apply custom className', () => {
    render(
      <FormField className="custom-field">
        <Input />
      </FormField>
    )
    const field = screen.getByRole('textbox').parentElement
    expect(field).toHaveClass('custom-field')
  })

  it('should render without label', () => {
    render(
      <FormField>
        <Input placeholder="No label" />
      </FormField>
    )
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText(/no label/i)).toBeInTheDocument()
  })

  it('should render complete form field with all props', () => {
    render(
      <FormField
        label="Password"
        htmlFor="password"
        required
        error="Password is required"
      >
        <Input id="password" type="password" />
      </FormField>
    )

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/password is required/i)
  })
})
