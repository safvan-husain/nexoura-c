'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FilterPanel, { FilterState } from './FilterPanel'
import VariantFilterPanel from './VariantFilterPanel'
import { ProductCrousel } from './ProductCrousel'
import ProductDetailsCard from './ProductDetailsCard'
import { div } from 'framer-motion/client'

interface ProductViewerProps {
  products: any[]
  initialIndex: number
}

export default function ProductViewer({ products, initialIndex }: ProductViewerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageTransition, setImageTransition] = useState(false)
  const [detailsTransition, setDetailsTransition] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [prevProduct, setPrevProduct] = useState(products[initialIndex])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const currentProduct = products[currentIndex]
  const currentVariant = currentProduct?.variants?.[currentVariantIndex]
  const images = currentVariant?.images || []
  const currentImage = images[currentImageIndex]

  const prevVariant = prevProduct?.variants?.[0]
  const prevImage = prevVariant?.images?.[0]

  // Get unique colors and sizes
  const availableColors = Array.from(new Set(currentProduct?.variants?.map((v: any) => v.color) || [])) as string[]
  const availableSizes = Array.from(new Set(currentProduct?.variants?.map((v: any) => v.size) || [])) as string[]

  useEffect(() => {
    setCurrentImageIndex(0)
    setCurrentVariantIndex(0)
    setSelectedColor(null)
    setSelectedSize(null)
    // Trigger transitions when product changes
    setImageTransition(true)
    setDetailsTransition(true)

    // After rotation completes, update prevProduct and disable transition
    const timer = setTimeout(() => {
      setPrevProduct(currentProduct)
      setDetailsTransition(false)
      // Small delay to let prevProduct update, then disable transition
      setTimeout(() => {
        setImageTransition(false)
      }, 50)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentIndex])

  // Handle variant selection by color/size
  const findAndSetVariant = (color: string | null, size: string | null) => {
    if (!currentProduct?.variants) return

    const matchingVariant = currentProduct.variants.findIndex((v: any) => {
      const colorMatch = !color || v.color === color
      const sizeMatch = !size || v.size === size
      return colorMatch && sizeMatch
    })

    if (matchingVariant >= 0) {
      setCurrentVariantIndex(matchingVariant)
      setCurrentImageIndex(0)
    }
  }

  const handleColorSelect = (color: string | null) => {
    setSelectedColor(color)
    findAndSetVariant(color, selectedSize)
  }

  const handleSizeSelect = (size: string | null) => {
    setSelectedSize(size)
    findAndSetVariant(selectedColor, size)
  }

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else if (currentIndex > 0) {
      setSlideDirection('left')
      setCurrentIndex(currentIndex - 1)
      router.push(`/?productId=${products[currentIndex - 1]._id}`, { scroll: false })
    }
  }

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else if (currentIndex < products.length - 1) {
      setSlideDirection('right')
      setCurrentIndex(currentIndex + 1)
      router.push(`/?productId=${products[currentIndex + 1]._id}`, { scroll: false })
    }
  }

  const handleProductSelect = (index: number) => {
    setSlideDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
    setCurrentImageIndex(0)
    router.push(`/?productId=${products[index]._id}`, { scroll: false })
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, currentImageIndex, images.length, products.length])

  if (!currentProduct) {
    return <div>Product not found</div>
  }

  const handleFilterChange = (filters: FilterState) => {
    // Filters are handled by URL params and page re-render
    // This is just a callback for the FilterPanel
  }

  return (
    <div className="relative">
      <div className="relative z-10 flex gap-4 h-[850px] mx-auto px-4 py-4">
        {/* Left Details Card */}
        <div className="absolute w-[360px] shrink-0 z-60 top-1/2 transform -translate-y-1/2 self-start">
          {(() => {
            const dummyProduct = {
              name: 'OVERSIZED BLACK HOODIE',
              price: 99.99,
              compareAtPrice: 129.99,
              shortDescription:
                'A minimalist premium oversized hoodie crafted from organic cotton.',
              description:
                'Featuring a matte texture and relaxed drop-shoulder design.',
            }

            const dummyVariant = {
              sku: 'HOODIE-BLK-XL',
              stock: 24,
            }

            return (
              <ProductDetailsCard
                product={dummyProduct}
                currentVariant={dummyVariant}
                detailsTransition={detailsTransition}
              />
            )
          })()}
        </div>
        <div className="flex flex-col flex-grow min-w-0 relative">
          <ProductCrousel
            products={products.map(p => ({
              img: p.variants?.[0]?.images?.[0]?.url || '',
              name: p.name,
              price: p.price,
              id: p._id
            }))}
            currentIndex={currentIndex}
            setCurrentIndex={handleProductSelect}
          />
        </div>

        {/* Other Products Gallery - Right Corner Vertical Grid */}
        <div className="w-28">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 sticky top-4">
            <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-2rem)] overflow-hidden">
              {products.map((product, index) => {
                const variant = product.variants?.[0]
                const image = variant?.images?.[0]

                return (
                  <button
                    key={product._id}
                    onClick={() => handleProductSelect(index)}
                    className={`flex-shrink-0 transition-all ${index === currentIndex
                      ? 'ring-2 ring-blue-500 scale-105'
                      : 'hover:scale-105'
                      }`}
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden mb-1">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.alt || product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z" />
                            <path d="M12 8.5c0-.83-.67-1.5-1.5-1.5S9 7.67 9 8.5 9.67 10 10.5 10s1.5-.67 1.5-1.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-blue-600 font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
