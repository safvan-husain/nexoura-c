import { Suspense } from 'react'
import { getCategories } from '@/lib/api/categories'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export default function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Manage Categories</h1>
          </div>
          <Link href="/admin/categories/new">
            <Button>+ Add Category</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<CategoriesLoading />}>
          <CategoriesListWrapper 
            pagePromise={searchParams.then((p) => parseInt(p.page || '1'))}
            searchPromise={searchParams.then((p) => p.search)}
          />
        </Suspense>
      </main>
    </div>
  )
}

async function CategoriesListWrapper({ 
  pagePromise, 
  searchPromise 
}: { 
  pagePromise: Promise<number>
  searchPromise: Promise<string | undefined>
}) {
  const page = await pagePromise
  const search = await searchPromise
  return <CategoriesList page={page} search={search} />
}

async function CategoriesList({ page, search }: { page: number; search?: string }) {
  const data = await getCategories({ page, limit: 20, search })

  if (!data.categories || data.categories.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500">No categories found</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {data.categories.map((category: any) => (
          <Card key={category._id} className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.slug}</p>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
              {category.parent && (
                <p className="text-xs text-blue-600 mt-1">
                  Parent: {category.parent.name}
                </p>
              )}
              <p className="text-xs mt-1">
                <span className={`px-2 py-1 rounded ${
                  category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                {' • '}
                <span className="text-gray-500">Order: {category.sortOrder}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/categories/${category._id}/edit`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
              <DeleteCategoryButton id={category._id} name={category.name} />
            </div>
          </Card>
        ))}
      </div>

      {data.pagination && data.pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {data.pagination.page > 1 && (
            <Link href={`/admin/categories?page=${data.pagination.page - 1}`}>
              <Button variant="secondary">Previous</Button>
            </Link>
          )}
          <span className="px-4 py-2">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          {data.pagination.page < data.pagination.pages && (
            <Link href={`/admin/categories?page=${data.pagination.page + 1}`}>
              <Button variant="secondary">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}

function CategoriesLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  )
}
