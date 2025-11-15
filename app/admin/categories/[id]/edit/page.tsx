import { Suspense } from 'react'
import Link from 'next/link'
import { CategoryForm } from '../../CategoryForm'
import { getCategories } from '@/lib/api/categories'

async function getCategoryById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/categories/${id}`,
    { cache: 'no-store' }
  )
  
  if (!res.ok) {
    throw new Error('Failed to fetch category')
  }
  
  return res.json()
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/categories" className="text-blue-600 hover:underline text-sm">
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryFormWrapper categoryId={id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

async function CategoryFormWrapper({ categoryId }: { categoryId: string }) {
  const [category, categoriesData] = await Promise.all([
    getCategoryById(categoryId),
    getCategories({ limit: 100, isActive: true })
  ])
  
  return (
    <CategoryForm 
      category={category} 
      categories={categoriesData.categories.filter((c: any) => c._id !== categoryId)} 
    />
  )
}
