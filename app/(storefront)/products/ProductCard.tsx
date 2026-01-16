'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  images: Array<{ url: string; alt?: string }>
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const primaryImage = product.images[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col"
    >
      <div className="aspect-[4/5] relative bg-[#f5f5f5] rounded-[2rem] overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/10">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={`/products/${product.slug}`}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest whitespace-nowrap hover:scale-105 active:scale-95 transition-all inline-block"
          >
            View Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold uppercase leading-tight group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xl font-black text-black">
            ${product.price}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
