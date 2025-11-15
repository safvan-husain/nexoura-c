import Link from 'next/link'
import { ProductForm } from '../ProductForm'

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/products" className="text-blue-600 hover:underline text-sm">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold mt-2">Create New Product</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProductForm mode="create" />
      </main>
    </div>
  )
}
