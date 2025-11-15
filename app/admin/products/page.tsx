import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProductFilters } from './ProductFilters'
import { ProductTile } from './ProductTile'

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string
    status?: string
    minStock?: string
    maxStock?: string
    showVariants?: string
  }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Manage Products</h1>
          </div>
          <Link href="/admin/products/new">
            <Button>+ Add Product</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<FiltersLoading />}>
          <ProductFilters />
        </Suspense>
        
        <Suspense fallback={<ProductsLoading />}>
          <ProductsListWrapper searchParamsPromise={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function ProductsListWrapper({ 
  searchParamsPromise 
}: { 
  searchParamsPromise: Promise<{
    page?: string
    status?: string
    minStock?: string
    maxStock?: string
    showVariants?: string
  }> 
}) {
  const params = await searchParamsPromise
  return <ProductsList params={params} />
}

async function ProductsList({ params }: { params: any }) {
  const page = parseInt(params.page || '1')
  const status = params.status
  const minStock = params.minStock ? parseInt(params.minStock) : undefined
  const maxStock = params.maxStock ? parseInt(params.maxStock) : undefined
  const showVariants = params.showVariants === 'true'

  const data = await getProducts({ 
    page, 
    limit: 20,
    status: status as any,
    minStock,
    maxStock
  })

  if (!data.products || data.products.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500">No products found</p>
      </Card>
    )
  }

  const buildPaginationUrl = (newPage: number) => {
    const urlParams = new URLSearchParams()
    urlParams.set('page', newPage.toString())
    if (status) urlParams.set('status', status)
    if (minStock !== undefined) urlParams.set('minStock', minStock.toString())
    if (maxStock !== undefined) urlParams.set('maxStock', maxStock.toString())
    if (showVariants) urlParams.set('showVariants', 'true')
    return `/admin/products?${urlParams.toString()}`
  }

  const totalItems = showVariants 
    ? data.products.reduce((sum: number, p: any) => sum + p.variants.length, 0)
    : data.products.length

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        Showing {totalItems} {showVariants ? 'variant' : 'product'}{totalItems !== 1 ? 's' : ''} 
        {data.pagination && ` (${data.pagination.total} total products)`}
      </div>

      <div className="space-y-3">
        {data.products.map((product: any) => {
          if (showVariants) {
            return product.variants.map((variant: any, idx: number) => (
              <ProductTile
                key={`${product._id}-${idx}`}
                product={product}
                variant={variant}
                showVariant={true}
              />
            ))
          }
          
          return (
            <ProductTile
              key={product._id}
              product={product}
            />
          )
        })}
      </div>

      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {data.pagination.page > 1 && (
            <Link href={buildPaginationUrl(data.pagination.page - 1)}>
              <Button variant="secondary">Previous</Button>
            </Link>
          )}
          <span className="px-4 py-2">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          {data.pagination.page < data.pagination.totalPages && (
            <Link href={buildPaginationUrl(data.pagination.page + 1)}>
              <Button variant="secondary">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}

function FiltersLoading() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

function ProductsLoading() {
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
