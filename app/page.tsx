import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import ProductViewer from './components/ProductViewer'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ProductViewerLoading />}>
        <ProductViewerWrapper productIdPromise={searchParams.then((p) => p.productId)} />
      </Suspense>
    </div>
  )
}

async function ProductViewerWrapper({
  productIdPromise,
}: {
  productIdPromise: Promise<string | undefined>
}) {
  const productId = await productIdPromise
  const data = await getProducts({ status: 'published', limit: 20 })
  
  if (!data.products || data.products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No products available</p>
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
