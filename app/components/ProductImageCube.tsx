'use client'

import Image from 'next/image'
import { Card } from './../ui/Card'

interface ProductImageCubeProps {
  currentProduct: any
  prevProduct: any
  nextProduct: any
  currentVariantIndex: number
  imageTransition: boolean
  slideDirection: 'left' | 'right'
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export default function ProductImageCube({
  currentProduct,
  prevProduct,
  nextProduct,
  currentVariantIndex,
  imageTransition,
  slideDirection,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: ProductImageCubeProps) {
  const PlaceholderIcon = () => (
    <svg
      className="w-32 h-32 text-gray-300"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z"/>
      <path d="M12 8.5c0-.83-.67-1.5-1.5-1.5S9 7.67 9 8.5 9.67 10 10.5 10s1.5-.67 1.5-1.5z"/>
    </svg>
  )

  // Get images for carousel
  const currentImage = currentProduct?.variants?.[currentVariantIndex]?.images?.[0]
  const prevImage = prevProduct?.variants?.[0]?.images?.[0]
  const nextImage = nextProduct?.variants?.[0]?.images?.[0]

  return (
    <>
      <style jsx>{`
        .carousel-container {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .carousel-container.sliding-right {
          transform: translateX(-33.33%);
        }
        
        .carousel-container.sliding-left {
          transform: translateX(33.33%);
        }
        
        .carousel-item {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="relative w-full h-[50vh] overflow-hidden">
        <div className={`relative h-full flex items-center justify-center gap-4 px-16 carousel-container ${
          imageTransition 
            ? slideDirection === 'right' 
              ? 'sliding-right' 
              : 'sliding-left'
            : ''
        }`}>
          {/* Left Side Image - Smaller & Blurred */}
          <div className="relative w-[25%] h-[70%] flex-shrink-0 carousel-item">
            {prevImage ? (
              <Card className="relative h-full overflow-hidden p-0 opacity-60 hover:opacity-80 transition-opacity cursor-pointer">
                <Image
                  src={prevImage.url}
                  alt={prevImage.alt || prevProduct?.name || 'Previous product'}
                  fill
                  className="object-cover blur-sm"
                />
              </Card>
            ) : (
              <div className="h-full bg-gray-100 rounded-lg opacity-30" />
            )}
          </div>

          {/* Center Image - Main Focus */}
          <div className="relative w-[50%] h-full flex-shrink-0 carousel-item">
            <Card className="relative h-full overflow-hidden p-0 shadow-2xl">
              {currentImage ? (
                <Image
                  key={`current-${currentProduct._id}-${currentVariantIndex}`}
                  src={currentImage.url}
                  alt={currentImage.alt || currentProduct.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <PlaceholderIcon />
                </div>
              )}
            </Card>
          </div>

          {/* Right Side Image - Smaller & Blurred */}
          <div className="relative w-[25%] h-[70%] flex-shrink-0 carousel-item">
            {nextImage ? (
              <Card className="relative h-full overflow-hidden p-0 opacity-60 hover:opacity-80 transition-opacity cursor-pointer">
                <Image
                  src={nextImage.url}
                  alt={nextImage.alt || nextProduct?.name || 'Next product'}
                  fill
                  className="object-cover blur-sm"
                />
              </Card>
            ) : (
              <div className="h-full bg-gray-100 rounded-lg opacity-30" />
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
