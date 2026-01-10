import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import { ProductCard } from './ProductCard'
import Link from 'next/link'

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<ProductsLoading />}>
          <ProductsListWrapper
            pagePromise={searchParams.then((params) => parseInt(params.page || '1'))}
            searchPromise={searchParams.then((params) => params.search)}
          />
        </Suspense>
      </main>
    </div>
  )
}

async function ProductsListWrapper({
  pagePromise,
  searchPromise,
}: {
  pagePromise: Promise<number>
  searchPromise: Promise<string | undefined>
}) {
  const page = await pagePromise
  const search = await searchPromise

  return <ProductsList page={page} search={search} />
}

async function ProductsList({ page, search }: { page: number; search?: string }) {
  const data = await getProducts({ page, search, status: 'published' })

  if (!data.products || data.products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {data.pagination && (
        <div className="mt-8 flex justify-center gap-2">
          {data.pagination.page > 1 && (
            <Link
              href={`/products?page=${data.pagination.page - 1}${search ? `&search=${search}` : ''}`}
              className="px-4 py-2 bg-white border rounded hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          {data.pagination.page < data.pagination.totalPages && (
            <Link
              href={`/products?page=${data.pagination.page + 1}${search ? `&search=${search}` : ''}`}
              className="px-4 py-2 bg-white border rounded hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  )
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}
