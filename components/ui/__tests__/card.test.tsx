import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText(/card content/i)).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Card ref={ref}>Content</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText(/header content/i)).toBeInTheDocument()
    })

    it('should apply padding styles', () => {
      render(<CardHeader>Header</CardHeader>)
      const header = screen.getByText(/header/i)
      expect(header).toHaveClass('p-4')
    })
  })

  describe('CardTitle', () => {
    it('should render as h3 element', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText(/card title/i)
      expect(title.tagName).toBe('H3')
    })

    it('should apply title styles', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText(/title/i)
      expect(title).toHaveClass('font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('should render description text', () => {
      render(<CardDescription>This is a description</CardDescription>)
      expect(screen.getByText(/this is a description/i)).toBeInTheDocument()
    })

    it('should apply description styles', () => {
      render(<CardDescription>Description</CardDescription>)
      const desc = screen.getByText(/description/i)
      expect(desc).toHaveClass('text-gray-500')
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Main content</CardContent>)
      expect(screen.getByText(/main content/i)).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText(/footer content/i)).toBeInTheDocument()
    })

    it('should apply flex styles', () => {
      render(<CardFooter>Footer</CardFooter>)
      const footer = screen.getByText(/footer/i)
      expect(footer).toHaveClass('flex')
    })
  })

  describe('Complete Card', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
          <CardContent>Card body content</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      )

      expect(screen.getByText(/test card/i)).toBeInTheDocument()
      expect(screen.getByText(/test description/i)).toBeInTheDocument()
      expect(screen.getByText(/card body content/i)).toBeInTheDocument()
      expect(screen.getByText(/footer actions/i)).toBeInTheDocument()
    })
  })
})
