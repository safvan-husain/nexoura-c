'use client'

import { Product } from './ProductViewer'

interface ProductDetailsCardProps {
  product: Product
  detailsTransition: boolean
}

export default function ProductDetailsCard({
  product,
  detailsTransition,
}: ProductDetailsCardProps) {
  const rating = 4.8
  const price = typeof product?.price === 'number' ? product.price : 0
  const brand = 'Nexoura'

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
        className={`relative p-6 text-gray-900 transition-all duration-500 ${detailsTransition ? 'fade-up' : ''}`}
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
            <span className="font-bold opacity-50 uppercase tracking-widest text-[10px]">{rating} / 5.0</span>
          </div>

          <div className="space-y-1 text-sm text-gray-700">
            <p className="uppercase tracking-[0.3em] text-[11px] text-gray-500">{brand}</p>
            <p className="font-bold uppercase tracking-tight text-xl mb-2">{product.name}</p>
            <p>
              {product.shortDescription ||
                'A minimalist premium product crafted for excellence.'}
            </p>
            <p className="text-gray-600">
              {product.description ||
                'Designed for elevated comfort and style, this piece represents the pinnacle of Nexoura design.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <span
              className={`rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] ${(product.stock ?? 0) > 0
                ? 'bg-black text-white'
                : 'bg-red-100 text-red-800'
                }`}
            >
              {(product.stock ?? 0) > 0
                ? `${product.stock} pieces in stock`
                : 'Out of stock'}
            </span>
          </div>

          <button className="mt-4 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
            Add to Bag
          </button>
        </div>
      </div>
    </>
  )
}
