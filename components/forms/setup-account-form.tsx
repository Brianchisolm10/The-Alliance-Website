'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { setupAccount, setupAccountSchema, type SetupAccountFormData } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SetupAccountFormProps {
  token: string
  email: string
}

export function SetupAccountForm({ token, email }: SetupAccountFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupAccountFormData>({
    resolver: zodResolver(setupAccountSchema),
    defaultValues: {
      token,
    },
  })

  const onSubmit = async (data: SetupAccountFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await setupAccount(data)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        router.push('/login?setup=success')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
        <p className="font-medium">Setting up account for:</p>
        <p className="mt-1">{email}</p>
      </div>

      <input type="hidden" {...register('token')} />

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <p className="text-xs text-gray-500">Must be at least 8 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Setting up account...' : 'Complete setup'}
      </Button>
    </form>
  )
}
