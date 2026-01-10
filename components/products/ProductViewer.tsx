'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCrousel } from './ProductCrousel'
import ProductDetailsCard from './ProductDetailsCard'
import ProductGridOverlay from './ProductGridOverlay'
import { Product } from '@/lib/services/product-service'

interface ProductViewerProps {
  products: Product[]
  initialIndex: number
}

export default function ProductViewer({ products, initialIndex }: ProductViewerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageTransition, setImageTransition] = useState(false)
  const [detailsTransition, setDetailsTransition] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [prevProduct, setPrevProduct] = useState(products[initialIndex])
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  const currentProduct = products[currentIndex]
  const images = currentProduct?.images || []
  const currentImage = images[currentImageIndex]

  const prevImage = prevProduct?.images?.[0]

  useEffect(() => {
    setCurrentImageIndex(0)
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

  // Scroll to top when overlay opens to ensure navbar is visible
  useEffect(() => {
    if (isOverlayOpen) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [isOverlayOpen])

  // Scroll/Wheel detection to trigger overlay
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isOverlayOpen) return

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

      if (isAtBottom && e.deltaY > 30) {
        setIsOverlayOpen(true)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isOverlayOpen) return

      const touchEndY = e.touches[0].clientY
      const deltaY = touchStartY - touchEndY // Positive if scrolling down (finger moving up)
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

      if (isAtBottom && deltaY > 50) { // Threshold of 50px for mobile
        setIsOverlayOpen(true)
      }
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOverlayOpen])

  return (
    <div className="relative">
      <div className="w-full h-[93vh] max-w-full overflow-x-hidden flex flex-col lg:flex-row items-center justify-center z-10 gap-4 lg:gap-22 min-h-[50dvh] lg:h-[850px] px-4 py-4 relative">
        {/* Left Details Card - Absolutely Positioned */}
        <div className="hidden lg:block absolute left-4 bottom-24 w-[20%] z-60">
          <ProductDetailsCard
            product={currentProduct}
            detailsTransition={detailsTransition}
          />
        </div>

        <div className="shrink-0 w-full lg:w-[70%] overflow-hidden relative h-[600px] md:h-full">
          <div className="ml-4 sm:ml-0 absolute w-[220%] md:w-full left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 h-full">
            <ProductCrousel
              products={products.map(p => ({
                img: p.images?.[0]?.url || '',
                name: p.name,
                price: p.price,
                id: p._id
              }))}
              currentIndex={currentIndex}
              setCurrentIndex={handleProductSelect}
              onViewAll={() => setIsOverlayOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className='hidden lg:block w-[25%] shrink-0 absolute right-10 bottom-10 flex flex-col gap-8 p-6 z-20'>
        <div className="flex items-center gap-2  border-b border-black/20">
          <div className="right-0 bottom-4">
            <svg className="w-6 h-6 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="SEARCH products"
            className="w-full bg-transparent text-2xl font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.4)] placeholder:text-black/20 focus:outline-none focus:border-black focus:[-webkit-text-stroke:1px_black] transition-all uppercase"
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.4em] text-black/40 font-bold uppercase transition-colors hover:text-black/60 cursor-default mt-1">Suggested Items</span>
          <div className="flex flex-col items-start gap-3">
            {['Minimalist Hoodie', 'Reflective Techwear', 'Urban Utility Cargo', 'Essential Basics'].map((item) => (
              <button
                key={item}
                className="text-xl font-black uppercase transition-all duration-500 hover:[-webkit-text-stroke:1px_black] hover:translate-x-3 text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.3)] text-left"
              >
                {item}
              </button>
            ))}
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
