import { Suspense } from 'react'
import ProductViewer from '@/components/products/ProductViewer'
import { getProducts } from '@/lib/product/product.service'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    productId?: string
  }>
}) {
  return (
    <div className="-mt-12 lg:-mt-22">
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

  // Fetch published products from the database
  const { products: rawProducts } = await getProducts({
    status: 'published',
    limit: 100,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // Serialize products for client component (convert _id to string)
  const products = rawProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    // Ensure images have the structure expected by UI if different
    // The service returns objects, ensuring compat with UI expectations:
    images: p.images?.map((img: any) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary
    })) || []
  }))

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No products found</p>
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
