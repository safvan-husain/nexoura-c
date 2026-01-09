import { Suspense } from 'react'
import ProductViewer from '@/components/products/ProductViewer'
import { getProducts } from '@/lib/services/product-service'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    productId?: string
  }>
}) {
  return (
    <div className="-mt-20">
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

  // Read images from public/images/no-bg folder
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No images found in the folder</p>
      </div>
    )
  }

  const currentIndex = productId
    ? products.findIndex((p: any) => p._id === productId)
    : 0

  return (
    <ProductViewer
      products={products}
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
