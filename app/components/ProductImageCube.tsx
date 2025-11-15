'use client'

import Image from 'next/image'

interface ProductImageCubeProps {
  currentImage: { url: string; alt?: string } | undefined
  prevImage: { url: string; alt?: string } | undefined
  currentProductName: string
  prevProductName: string
  currentProductId: string
  prevProductId: string
  images: any[]
  currentImageIndex: number
  imageTransition: boolean
  slideDirection: 'left' | 'right'
  onPrevious: () => void
  onNext: () => void
  onImageSelect: (index: number) => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export default function ProductImageCube({
  currentImage,
  prevImage,
  currentProductName,
  prevProductName,
  currentProductId,
  prevProductId,
  images,
  currentImageIndex,
  imageTransition,
  slideDirection,
  onPrevious,
  onNext,
  onImageSelect,
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

  return (
    <>
      <style jsx>{`
        .cube-container {
          perspective: 1500px;
        }
        
        .cube-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: center center;
        }
        
        .cube-wrapper:not(.rotate-left):not(.rotate-right) {
          transition: none;
        }
        
        .cube-wrapper.rotate-left,
        .cube-wrapper.rotate-right {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          overflow: hidden;
        }
        
        .cube-front {
          transform: rotateY(0deg) translateZ(200px);
        }
        
        .cube-right {
          transform: rotateY(90deg) translateZ(200px);
        }
        
        .cube-left {
          transform: rotateY(-90deg) translateZ(200px);
        }
        
        .rotate-left {
          transform: translateZ(-200px) rotateY(90deg);
        }
        
        .rotate-right {
          transform: translateZ(-200px) rotateY(-90deg);
        }
      `}</style>

      <div className="relative cube-container">
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden h-[50vh] w-[50vh]">
          <div className={`cube-wrapper ${
            imageTransition 
              ? slideDirection === 'right' 
                ? 'rotate-right' 
                : 'rotate-left'
              : ''
          }`}>
            {/* Front face - old image that rotates away */}
            <div className="cube-face cube-front">
              {prevImage ? (
                <Image
                  key={`prev-${prevProductId}`}
                  src={prevImage.url}
                  alt={prevImage.alt || prevProductName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <PlaceholderIcon />
                </div>
              )}
            </div>
            
            {/* Side face - new image coming in from the side */}
            <div className={`cube-face ${slideDirection === 'right' ? 'cube-right' : 'cube-left'}`}>
              {currentImage ? (
                <Image
                  key={`current-${currentProductId}`}
                  src={currentImage.url}
                  alt={currentImage.alt || currentProductName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <PlaceholderIcon />
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Progress Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => onImageSelect(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
