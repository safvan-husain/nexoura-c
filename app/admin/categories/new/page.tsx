import { Suspense } from 'react'
import Link from 'next/link'
import { CategoryForm } from '../CategoryForm'
import { getCategories } from '@/lib/api/categories'

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/categories" className="text-blue-600 hover:underline text-sm">
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">Add New Category</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryFormWrapper />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

async function CategoryFormWrapper() {
  const data = await getCategories({ limit: 100, isActive: true })
  return <CategoryForm categories={data.categories} />
}
