import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import ProductViewer from './components/ProductViewer'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ 
    productId?: string
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    status?: string
    minStock?: string
    maxStock?: string
    sortBy?: string
    sortOrder?: string
  }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ProductViewerLoading />}>
        <ProductViewerWrapper searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  )
}

async function ProductViewerWrapper({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<any>
}) {
  const params = await searchParamsPromise
  const productId = params.productId
  
  // Build query from search params
  const query: any = {
    status: params.status || 'published',
    limit: 100,
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder || 'desc',
  }
  
  if (params.search) query.search = params.search
  if (params.category) query.category = params.category
  if (params.minPrice) query.minPrice = parseFloat(params.minPrice)
  if (params.maxPrice) query.maxPrice = parseFloat(params.maxPrice)
  if (params.minStock) query.minStock = parseInt(params.minStock)
  if (params.maxStock) query.maxStock = parseInt(params.maxStock)
  
  const data = await getProducts(query)
  
  if (!data.products || data.products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No products found matching your filters</p>
      </div>
    )
  }

  const currentIndex = productId 
    ? data.products.findIndex((p: any) => p._id === productId)
    : 0
  
  return (
    <ProductViewer 
      products={data.products} 
      initialIndex={currentIndex >= 0 ? currentIndex : 0}
    />
  )
}

function ProductViewerLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading products...</div>
    </div>
  )
}
