'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { handleLogin } from '@/lib/auth/auth.controller'

export async function loginAction(_prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { status, body } = await handleLogin({ email, password })

  if (status !== 200) {
    return { error: (body as any).error || 'Login failed' }
  }

  // Set auth cookie
  const cookieStore = await cookies()
  cookieStore.set('auth_token', (body as any).token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/products')
}

export async function registerAction(_prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string

  const { handleRegister } = await import('@/lib/auth/auth.controller')
  const { status, body } = await handleRegister({ email, password, firstName, lastName, phone })

  if (status !== 201) {
    return { error: (body as any).error || 'Registration failed' }
  }

  // Set auth cookie
  const cookieStore = await cookies()
  cookieStore.set('auth_token', (body as any).token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/products')
}

export async function adminLoginAction(_prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { handleAdminLogin } = await import('@/lib/auth/auth.controller')
  const { status, body } = await handleAdminLogin({ email, password })

  if (status !== 200) {
    return { error: (body as any).error || 'Admin login failed' }
  }

  // Set admin auth cookie
  const cookieStore = await cookies()
  cookieStore.set('admin_token', (body as any).token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/admin/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('admin_token')
  redirect('/login')
}
