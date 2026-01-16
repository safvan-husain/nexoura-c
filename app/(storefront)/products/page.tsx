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
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
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
      <div className="text-center py-24">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">No products found</h2>
        <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">
            Our Collection
          </h1>
          <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm">
            {data.pagination?.totalProducts || data.products.length} Products Available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {data.products.map((product: any, index: number) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-24 pt-12 border-t border-gray-100 flex justify-center items-center gap-8">
          {data.pagination.page > 1 && (
            <Link
              href={`/products?page=${data.pagination.page - 1}${search ? `&search=${search}` : ''}`}
              className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Page {data.pagination.page} / {data.pagination.totalPages}
          </span>
          {data.pagination.page < data.pagination.totalPages && (
            <Link
              href={`/products?page=${data.pagination.page + 1}${search ? `&search=${search}` : ''}`}
              className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}

      {/* Footer Branding similar to Overlay */}
      <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col items-center gap-6 text-center">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.3em]">Nexoura Premium Collection</p>
        <div className="flex gap-8">
          {['Instagram', 'Twitter', 'Facebook'].map(social => (
            <span key={social} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-black transition-colors">{social}</span>
          ))}
        </div>
      </div>
    </>
  )
}

function ProductsLoading() {
  return (
    <>
      <div className="mb-12 animate-pulse">
        <div className="h-12 md:h-20 bg-gray-100 rounded-2xl w-64 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded-full w-40"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-6">
            <div className="aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse"></div>
            <div className="flex justify-between items-start px-2">
              <div className="h-6 bg-gray-100 rounded-full w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
