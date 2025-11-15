import { Suspense } from 'react'
import Link from 'next/link'
import { ProductForm } from '../../ProductForm'
import { Card } from '@/components/ui/Card'

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }

  return res.json()
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/products" className="text-blue-600 hover:underline text-sm">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold mt-2">Edit Product</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Suspense fallback={<LoadingForm />}>
          <ProductFormWrapper paramsPromise={params} />
        </Suspense>
      </main>
    </div>
  )
}

async function ProductFormWrapper({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise
  const product = await getProduct(id)
  
  return <ProductForm product={product} mode="edit" />
}

function LoadingForm() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}
