import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeleteProductButton } from './DeleteProductButton'

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
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
        <Suspense fallback={<ProductsLoading />}>
          <ProductsListWrapper pagePromise={searchParams.then((p) => parseInt(p.page || '1'))} />
        </Suspense>
      </main>
    </div>
  )
}

async function ProductsListWrapper({ pagePromise }: { pagePromise: Promise<number> }) {
  const page = await pagePromise
  return <ProductsList page={page} />
}

async function ProductsList({ page }: { page: number }) {
  const data = await getProducts({ page, limit: 20 })

  if (!data.products || data.products.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500">No products found</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {data.products.map((product: any) => (
          <Card key={product._id} className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.slug}</p>
              <p className="text-sm">
                <span className="font-medium">${product.price.toFixed(2)}</span>
                {' • '}
                <span className={`px-2 py-1 rounded text-xs ${
                  product.status === 'published' ? 'bg-green-100 text-green-800' :
                  product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/products/${product._id}/edit`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
              <DeleteProductButton id={product._id} name={product.name} />
            </div>
          </Card>
        ))}
      </div>

      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {data.pagination.page > 1 && (
            <Link href={`/admin/products?page=${data.pagination.page - 1}`}>
              <Button variant="secondary">Previous</Button>
            </Link>
          )}
          <span className="px-4 py-2">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          {data.pagination.page < data.pagination.totalPages && (
            <Link href={`/admin/products?page=${data.pagination.page + 1}`}>
              <Button variant="secondary">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
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
