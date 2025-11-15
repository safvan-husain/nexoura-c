import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { DeleteProductButton } from './DeleteProductButton'
import { ProductImage } from './ProductImage'

interface ProductTileProps {
  product: any
  variant?: any
  showVariant?: boolean
}

export function ProductTile({ product, variant, showVariant = false }: ProductTileProps) {
  const displayName = showVariant && variant ? `${product.name} - ${variant.name}` : product.name
  const displayStock = showVariant && variant ? variant.stock : product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
  const displayImage = showVariant && variant?.images?.[0]?.url 
    ? variant.images[0].url 
    : product.variants[0]?.images?.[0]?.url || '/placeholder-product.svg'
  const displaySku = showVariant && variant ? variant.sku : `${product.variants.length} variant${product.variants.length > 1 ? 's' : ''}`

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <ProductImage src={displayImage} alt={displayName} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold truncate">{displayName}</h3>
        <p className="text-sm text-gray-600 mb-2">{displaySku}</p>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
          
          <span className={`px-2 py-1 rounded text-xs ${
            product.status === 'published' ? 'bg-green-100 text-green-800' :
            product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {product.status}
          </span>

          <span className={`px-2 py-1 rounded text-xs font-medium ${
            displayStock > 10 ? 'bg-green-100 text-green-800' :
            displayStock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            Stock: {displayStock}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-center">
        <Link href={`/admin/products/${product._id}/edit`}>
          <Button variant="secondary" size="sm" className="w-full">Edit</Button>
        </Link>
        {!showVariant && (
          <DeleteProductButton id={product._id} name={product.name} />
        )}
      </div>
    </div>
  )
}
