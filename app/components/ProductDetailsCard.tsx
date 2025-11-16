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

      <div className={`bg-white rounded-lg shadow-md h-[50vh] flex flex-col ${
        detailsTransition ? 'fade-up' : ''
      }`}>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-3">{product.name || 'Product Name'}</h1>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-gray-600 mb-3 text-sm">{product.shortDescription}</p>
          )}

          <div className="mb-4">
            <h3 className="font-semibold mb-1 text-sm">Description</h3>
            <p className="text-gray-700 text-sm">{product.description || 'No description available'}</p>
          </div>
        </div>
        
        {/* Fixed Bottom Section */}
        <div className="border-t bg-white p-4">
          {currentVariant && (
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">SKU:</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{currentVariant.sku || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Stock:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  (currentVariant.stock ?? 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {(currentVariant.stock ?? 0) > 0 ? `${currentVariant.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  )
}
