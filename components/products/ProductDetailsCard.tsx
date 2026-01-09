'use client'

interface ProductDetailsCardProps {
  product: any
  currentVariant: any
  detailsTransition: boolean
}

export default function ProductDetailsCard({
  product,
  currentVariant,
  detailsTransition,
}: ProductDetailsCardProps) {
  const colors =
    Array.from(
      new Set(
        (product?.variants || [])
          .map((variant: any) => variant?.colorHex || variant?.color)
          .filter(Boolean)
      )
    ) || []

  const sizes =
    Array.from(
      new Set((product?.variants || []).map((variant: any) => variant?.size).filter(Boolean))
    ) || []

  const rating = typeof product?.rating === 'number' ? product.rating : 4.8
  const reviews = product?.reviewsCount ?? 241
  const price = typeof product?.price === 'number' ? product.price : 0
  const category = product?.category || 'Category'
  const brand = product?.brand || 'Addesjan'

  return (
    <>
      <style jsx>{`
        @keyframes fadeUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div
        className={`relative  p-6 text-gray-900  transition-all duration-500 ${detailsTransition ? 'fade-up' : ''
          }`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-6 right-10 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-5">

          <div className="text-4xl font-semibold tracking-tight">${price.toFixed(2)}</div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex text-[#f1c40f]">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>


          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gray-500">
              Colors
            </p>
            <div className="mt-3 flex gap-3">
              {(colors.length ? colors : ['#111827', '#d1d5db', '#d1b68f']).map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className="h-10 w-10 rounded-full border border-white/70 shadow-sm outline-offset-2 transition hover:scale-105"
                  style={{ 'backgroundColor': color as any }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gray-500">
              Sizes
            </p>
            <div className="mt-3 flex gap-3">
              {(sizes.length ? sizes : ['XS', 'S', 'M', 'XL']).map((size, index) => (
                <button
                  key={`${size}-${index}`}
                  className="rounded-xl border border-gray-300 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {size as any}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-700">
            <p className="uppercase tracking-[0.3em] text-[11px] text-gray-500">{brand}</p>
            <p>
              {product.shortDescription ||
                'A minimalist premium oversized hoodie crafted from organic cotton, featuring a matte texture and relaxed drop-shoulder design.'}
            </p>
            <p className="text-gray-600">
              {product.description ||
                'Designed for elevated comfort with a matte finish, breathable interior, and tailored silhouette that drapes effortlessly.'}
            </p>
          </div>

          {currentVariant && (
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <span className="rounded-full bg-white/70 px-3 py-1 font-semibold uppercase tracking-wider">
                SKU {currentVariant.sku || 'N/A'}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wider ${(currentVariant.stock ?? 0) > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}
              >
                {(currentVariant.stock ?? 0) > 0
                  ? `${currentVariant.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
