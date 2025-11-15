import { Suspense } from 'react'
import { getProductById } from '@/lib/api/products'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/products" className="text-blue-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<ProductDetailLoading />}>
          <ProductDetailWrapper idPromise={params.then((p) => p.id)} />
        </Suspense>
      </main>
    </div>
  )
}

async function ProductDetailWrapper({ idPromise }: { idPromise: Promise<string> }) {
  const id = await idPromise
  return <ProductDetail id={id} />
}

async function ProductDetail({ id }: { id: string }) {
  try {
    const product = await getProductById(id)

    if (!product) {
      notFound()
    }

    const primaryImage = product.variants[0]?.images[0]?.url
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full rounded-lg"
            />
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </Card>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </Card>

          {product.variants && product.variants.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Variants</h2>
              <div className="space-y-3">
                {product.variants.map((variant: any, index: number) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <p className="font-medium">{variant.name}</p>
                    <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                    <p className="text-sm text-gray-600">Stock: {variant.stock}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

function ProductDetailLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
