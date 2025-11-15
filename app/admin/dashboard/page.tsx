import { Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Products</h2>
              <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
                <ProductCount />
              </Suspense>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Categories</h2>
              <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
                <CategoryCount />
              </Suspense>
            </Card>
          </Link>

          <Card>
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="block text-blue-600 hover:underline"
              >
                + Add Product
              </Link>
              <Link
                href="/admin/categories/new"
                className="block text-blue-600 hover:underline"
              >
                + Add Category
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

async function ProductCount() {
  const data = await getProducts({ limit: 1 })
  return <p className="text-3xl font-bold">{data.pagination?.total || 0}</p>
}

async function CategoryCount() {
  const data = await getCategories({ limit: 1 })
  return <p className="text-3xl font-bold">{data.pagination?.total || 0}</p>
}
