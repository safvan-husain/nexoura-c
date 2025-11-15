import { Suspense } from 'react'
import { AdminLoginForm } from './AdminLoginForm'
import { Card } from '@/components/ui/Card'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminLoginForm />
        </Suspense>
      </Card>
    </div>
  )
}
