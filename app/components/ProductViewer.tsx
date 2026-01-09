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
      <div className="w-full h-screen max-w-full overflow-x-hidden flex flex-col lg:flex-row items-center justify-center z-10 gap-4 lg:gap-22 min-h-[50dvh] lg:h-[850px] px-4 py-4 relative">
        {/* Placeholder to maintain layout space */}
        {/* <div className="w-[10%] shrink-0"></div> */}

        {/* Left Details Card - Absolutely Positioned - Hidden for now as originally coded */}
        <div className="hidden lg:block absolute left-4 top-24 w-[20%] z-60">
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

        <div className="shrink-0 w-full lg:w-[67%] overflow-hidden -mt-[50px] relative h-[600px] md:h-full">
          <div className="ml-4 sm:ml-0 absolute w-[220%] md:w-full left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 h-full">
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
        </div>
      </div>
      <div className='hidden lg:block w-[30%] shrink-0 absolute right-10 bottom-10 flex flex-col gap-8 p-6 z-20'>
        <div className="flex items-center gap-2  border-b border-black/20">
          <div className="right-0 bottom-4">
            <svg className="w-6 h-6 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="SEARCH products"
            className="w-full bg-transparent py-3 text-4xl font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.4)] placeholder:text-black/20 focus:outline-none focus:border-black focus:[-webkit-text-stroke:1px_black] transition-all uppercase"
          />

        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.4em] text-black/40 font-bold uppercase transition-colors hover:text-black/60 cursor-default">Suggested Items</span>
          <div className="flex flex-col items-start gap-3">
            {['Minimalist Hoodie', 'Reflective Techwear', 'Urban Utility Cargo', 'Essential Basics'].map((item) => (
              <button
                key={item}
                className="text-3xl font-black uppercase transition-all duration-500 hover:[-webkit-text-stroke:1px_black] hover:translate-x-3 text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.3)] text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
