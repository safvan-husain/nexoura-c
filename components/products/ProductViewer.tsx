'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCrousel } from './ProductCrousel'
import ProductDetailsCard from './ProductDetailsCard'
import ProductGridOverlay from './ProductGridOverlay'

export interface Product {
  _id: string
  name: string
  price: number
  compareAtPrice?: number
  description: string
  shortDescription?: string
  status: string
  images: {
    url: string
    alt?: string
    isPrimary?: boolean
  }[]
  stock: number
  tags?: string[]
  metadata?: Record<string, any>
  slug: string
  subtitle?: string
  hasSizes?: boolean
  sizes?: string[]
}

interface ProductViewerProps {
  products: Product[]
  initialIndex: number
}

export default function ProductViewer({ products, initialIndex }: ProductViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageTransition, setImageTransition] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [prevProduct, setPrevProduct] = useState(products[initialIndex])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const isOverlayOpen = searchParams.get('view') === 'overlay'

  const setIsOverlayOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (open) {
      params.set('view', 'overlay')
    } else {
      params.delete('view')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return products.slice(0, 4)
    }
    const query = searchQuery.toLowerCase()
    return products
      .filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, 5)
  }, [products, searchQuery])

  const currentProduct = products[currentIndex]
  const images = currentProduct?.images || []
  const currentImage = images[currentImageIndex]

  const prevImage = prevProduct?.images?.[0]

  useEffect(() => {
    setCurrentImageIndex(0)
    // Trigger transitions when product changes
    setImageTransition(true)

    // After rotation completes, update prevProduct and disable transition
    const timer = setTimeout(() => {
      setPrevProduct(currentProduct)
      // Small delay to let prevProduct update, then disable transition
      setTimeout(() => {
        setImageTransition(false)
      }, 50)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentIndex])

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else if (currentIndex > 0) {
      setSlideDirection('left')
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else if (currentIndex < products.length - 1) {
      setSlideDirection('right')
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleProductSelect = (index: number) => {
    setSlideDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
    setCurrentImageIndex(0)
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

  // Scroll to top when overlay opens to ensure navbar is visible
  useEffect(() => {
    if (isOverlayOpen) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [isOverlayOpen])

  // Scroll/Wheel and Swipe detection
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isOverlayOpen) return

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

      if (isAtBottom && e.deltaY > 30) {
        setIsOverlayOpen(true)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isOverlayOpen) return
      // We handle vertical move only
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isOverlayOpen) return

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchStartX - touchEndX
      const deltaY = touchStartY - touchEndY

      // Horizontal Swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handleNext()
        } else {
          handlePrevious()
        }
      } 
      // Vertical Swipe (at bottom only)
      else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) {
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
        if (isAtBottom) {
          setIsOverlayOpen(true)
        }
      }
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOverlayOpen, currentIndex, currentImageIndex, products.length, images.length])

  return (
    <div className="relative group/viewer">
      <div className="w-full h-[93vh] max-w-full overflow-x-hidden flex flex-col lg:flex-row items-center justify-center z-10 gap-4 lg:gap-22 min-h-[50dvh] lg:h-[100vh] px-4 py-4 relative">
        {/* Left Details Card - Absolutely Positioned */}
        <div className="hidden lg:block absolute left-4 bottom-0 w-[20%] z-60">
          <ProductDetailsCard
            product={currentProduct}
          />
        </div>

        <div className="shrink-0 w-full lg:w-[70%] overflow-hidden relative h-[600px] md:h-full">
          {/* Navigation Arrows - Repositioned around the main product */}
          <button
            onClick={handlePrevious}
            className="absolute left-[4%] md:left-[26%] top-[30%] md:top-4/10 -translate-y-1/2 z-60 p-2 md:p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-black/30 hover:text-black hover:bg-white/20 hover:border-white/30 transition-all active:scale-90"
            aria-label="Previous product"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[4%] md:right-[26%] top-[30%] md:top-4/10 -translate-y-1/2 z-60 p-2 md:p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-black/30 hover:text-black hover:bg-white/20 hover:border-white/30 transition-all active:scale-90"
            aria-label="Next product"
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute w-[220%] md:w-full left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 h-full">
            <ProductCrousel
              products={products.map(p => ({
                img: p.images?.[0]?.url || '',
                name: p.name,
                price: p.price,
                id: p._id,
                slug: p.slug,
                description: p.description,
                subtitle: p.subtitle || p.shortDescription
              }))}
              currentIndex={currentIndex}
              setCurrentIndex={handleProductSelect}
              onViewAll={() => setIsOverlayOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className='hidden lg:block w-[25%] shrink-0 absolute right-10 top-[60%] flex flex-col gap-8 p-6 z-20'>
        <div className="flex items-center gap-2  border-b border-black/20">
          <div className="right-0 bottom-4">
            <svg className="w-6 h-6 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="SEARCH products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-2xl font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.4)] placeholder:text-black/20 focus:outline-none focus:border-black focus:[-webkit-text-stroke:1px_black] transition-all uppercase"
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.4em] text-black/40 font-bold uppercase transition-colors hover:text-black/60 cursor-default mt-1">
            {searchQuery ? 'Search Results' : 'Suggested Items'}
          </span>
          <div className="flex flex-col items-start gap-3">
            {filteredSuggestions.map((product) => (
              <button
                key={product._id}
                onClick={() => router.push(`/products/${product.slug}`)}
                className="text-xl font-black uppercase transition-all duration-500 hover:[-webkit-text-stroke:1px_black] hover:translate-x-3 text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.3)] text-left"
              >
                {product.name}
              </button>
            ))}
            {searchQuery && filteredSuggestions.length === 0 && (
              <span className="text-sm font-bold text-black/20 uppercase">No items found</span>
            )}
          </div>
        </div>
      </div>

      <ProductGridOverlay
        products={products}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
      />
    </div>
  )
}
