'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProductViewerProps {
  products: any[]
  initialIndex: number
}

export default function ProductViewer({ products, initialIndex }: ProductViewerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const currentProduct = products[currentIndex]
  const currentVariant = currentProduct?.variants?.[0]
  const images = currentVariant?.images || []
  const currentImage = images[currentImageIndex]

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [currentIndex])

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      router.push(`/?productId=${products[currentIndex - 1]._id}`, { scroll: false })
    }
  }

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1)
      router.push(`/?productId=${products[currentIndex + 1]._id}`, { scroll: false })
    }
  }

  const handleProductSelect = (index: number) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main Product View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section with Navigation */}
        <div className="relative">
          <div className="relative aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || currentProduct.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
              </div>
            )}
            
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 && currentImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex === products.length - 1 && currentImageIndex === images.length - 1}
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
                    onClick={() => setCurrentImageIndex(idx)}
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

        {/* Product Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>
          
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-blue-600">
              ${currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.compareAtPrice && (
              <span className="text-xl text-gray-400 line-through">
                ${currentProduct.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {currentProduct.shortDescription && (
            <p className="text-gray-600 mb-4">{currentProduct.shortDescription}</p>
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{currentProduct.description}</p>
          </div>

          {currentVariant && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Color:</span>
                <span className="px-3 py-1 bg-gray-100 rounded">{currentVariant.color}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Size:</span>
                <span className="px-3 py-1 bg-gray-100 rounded">{currentVariant.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Stock:</span>
                <span className={`px-3 py-1 rounded ${
                  currentVariant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentVariant.stock > 0 ? `${currentVariant.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Other Products Gallery */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Other Products</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {products.map((product, index) => {
              const variant = product.variants?.[0]
              const image = variant?.images?.[0]
              
              return (
                <button
                  key={product._id}
                  onClick={() => handleProductSelect(index)}
                  className={`flex-shrink-0 w-32 transition-all ${
                    index === currentIndex 
                      ? 'ring-4 ring-blue-500 scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
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
                          className="w-12 h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
                          <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z"/>
                          <path d="M12 8.5c0-.83-.67-1.5-1.5-1.5S9 7.67 9 8.5 9.67 10 10.5 10s1.5-.67 1.5-1.5z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-sm text-blue-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
