'use client'

import { useActionState } from 'react'
import { adminLoginAction } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      
      <Input
        label="Admin Email"
        type="email"
        name="email"
        required
        autoComplete="email"
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        required
        autoComplete="current-password"
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Logging in...' : 'Admin Login'}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        <Link href="/login" className="text-blue-600 hover:underline">
          User Login
        </Link>
      </p>
    </form>
  )
}
