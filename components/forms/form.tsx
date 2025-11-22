'use client'

import * as React from 'react'
import { useForm, UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>
  onSubmit: SubmitHandler<T>
  defaultValues?: Partial<T>
  children: (methods: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className = '',
}: FormProps<T>) {
  const methods = useForm<T>({
    // @ts-expect-error - zodResolver type compatibility issue
    resolver: zodResolver(schema),
    // @ts-expect-error - defaultValues type compatibility issue
    defaultValues,
  })

  return (
    // @ts-expect-error - handleSubmit type compatibility issue
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
      {/* @ts-expect-error - methods type compatibility issue */}
      {children(methods)}
    </form>
  )
}
