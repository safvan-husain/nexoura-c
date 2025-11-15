'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      
      <Input
        label="First Name"
        type="text"
        name="firstName"
        required
        autoComplete="given-name"
      />
      
      <Input
        label="Last Name"
        type="text"
        name="lastName"
        required
        autoComplete="family-name"
      />
      
      <Input
        label="Email"
        type="email"
        name="email"
        required
        autoComplete="email"
      />
      
      <Input
        label="Phone (optional)"
        type="tel"
        name="phone"
        autoComplete="tel"
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        required
        autoComplete="new-password"
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Creating account...' : 'Register'}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
