'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  id: string
  name: string
  content: string
  imageUrl: string | null
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  const nextTestimonial = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const previousTestimonial = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Auto-rotate testimonials
  React.useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextTestimonial, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Community Says
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real stories from real people on their wellness journey
          </p>
        </div>

        <div className="mt-12 relative">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center text-center">
                {currentTestimonial.imageUrl && (
                  <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={currentTestimonial.imageUrl}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                )}
                
                <svg
                  className="mb-4 h-10 w-10 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <blockquote className="text-lg text-gray-700 sm:text-xl">
                  {currentTestimonial.content}
                </blockquote>

                <div className="mt-6">
                  <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() => {
                  previousTestimonial()
                  setIsAutoPlaying(false)
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Previous testimonial"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  nextTestimonial()
                  setIsAutoPlaying(false)
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Next testimonial"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {testimonials.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
