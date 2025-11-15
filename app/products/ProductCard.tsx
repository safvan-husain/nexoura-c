import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  variants: Array<{
    name: string
    images: Array<{ url: string; alt?: string }>
  }>
}

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.variants[0]?.images[0]?.url
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {primaryImage && (
          <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          {hasDiscount && product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}
