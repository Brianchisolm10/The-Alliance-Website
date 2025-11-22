'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitDiscoveryForm } from '@/app/actions/discovery'
import { discoveryFormSchema, type DiscoveryFormData } from '@/lib/validations/discovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function DiscoveryForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscoveryFormData>({
    resolver: zodResolver(discoveryFormSchema),
  })

  const onSubmit = async (data: DiscoveryFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await submitDiscoveryForm(data)

      if (result.error) {
        setError(result.error)
      } else if (result.success && result.submissionId) {
        // Redirect to scheduling page with submission ID
        router.push(`/start/schedule?id=${result.submissionId}`)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          error={!!errors.name}
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          error={!!errors.email}
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal">Primary Goal *</Label>
        <Textarea
          id="goal"
          placeholder="Tell us about your primary wellness goal (e.g., improve fitness, nutrition guidance, recovery support)..."
          rows={4}
          error={!!errors.goal}
          {...register('goal')}
          disabled={isLoading}
        />
        {errors.goal && <p className="text-sm text-red-600">{errors.goal.message}</p>}
        <p className="text-xs text-gray-500">Minimum 10 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information you'd like to share..."
          rows={3}
          error={!!errors.notes}
          {...register('notes')}
          disabled={isLoading}
        />
        {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Continue to Scheduling'}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By submitting this form, you agree to be contacted by AFYA regarding your wellness journey.
      </p>
    </form>
  )
}
