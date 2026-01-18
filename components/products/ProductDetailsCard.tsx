'use client'

import { Product } from './ProductViewer'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import CheckoutModal from '@/components/checkout/CheckoutModal'
import { useStorefrontSession } from '@/components/providers/StorefrontSessionProvider'

interface ProductDetailsCardProps {
  product: Product
}

export default function ProductDetailsCard({
  product,
}: ProductDetailsCardProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { session } = useStorefrontSession()
  const rating = 4.8
  const price = typeof product?.price === 'number' ? product.price : 0

  const slideVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 }
  }

  const springTransition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
  }

  return (
    <div className="relative p-6 text-gray-900 min-h-[450px] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-6 right-10 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 flex-1">
        {/* Price Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`price-${product?._id}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
            transition={springTransition}
            className="text-4xl font-semibold tracking-tight"
          >
            ${price.toFixed(2)}
          </motion.div>
        </AnimatePresence>

        {/* Rating Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`rating-${product?._id}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
            transition={{ ...springTransition, delay: 0.05 }}
            className="flex items-center gap-4 text-sm text-gray-600"
          >
            <div className="flex text-[#f1c40f]">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="font-bold opacity-50 uppercase tracking-widest text-[10px]">{rating} / 5.0</span>
          </motion.div>
        </AnimatePresence>

        {/* Details Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`name-${product?._id}`}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={{ ...springTransition, delay: 0.1 }}
                className="font-bold uppercase tracking-tight text-xl line-clamp-1"
              >
                {product.name}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={`short-${product?._id}`}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={{ ...springTransition, delay: 0.15 }}
                className="line-clamp-1 h-5 text-gray-600 italic text-sm"
              >
                {product.shortDescription || 'A minimalist premium product crafted for excellence.'}
              </motion.p>
            </AnimatePresence>

            <div className="h-[4.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${product?._id}`}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                  transition={{ ...springTransition, delay: 0.2 }}
                  className="text-gray-500 text-sm line-clamp-3 leading-relaxed"
                >
                  {product.description || 'Designed for elevated comfort and style, this piece represents the pinnacle of Nexoura design.'}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Buy Now Button */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`actions-${product?._id}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
            transition={{ ...springTransition, delay: 0.25 }}
            className="mt-auto pt-4"
          >
            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={product.stock <= 0}
              className={`w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] py-4 rounded-xl transition-all hover:bg-gray-900 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400`}
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={product}
        initialBillingDetails={session?.billingDetails}
      />
    </div>
  )
}
