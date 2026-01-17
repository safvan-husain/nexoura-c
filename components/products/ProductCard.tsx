'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from './ProductViewer'
import { useStorefrontWishlist } from '@/components/providers/StorefrontWishlistProvider'

interface ProductCardProps {
    product: Product
    index?: number
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={filled ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
)

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { isInWishlist, toggleWishlistItem } = useStorefrontWishlist()
    const inWishlist = isInWishlist(product._id)

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlistItem(product._id)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col"
        >
            <div className="aspect-[4/5] relative bg-[#f5f5f5] rounded-[2rem] overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/10">
                <Image
                    src={product.images[0]?.url || ''}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${inWishlist
                            ? 'bg-black text-white'
                            : 'bg-white/80 text-black hover:bg-black hover:text-white'
                        }`}
                >
                    <HeartIcon filled={inWishlist} />
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick Add Button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link href={`/products/${product.slug}`} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest whitespace-nowrap hover:scale-105 active:scale-95 transition-all inline-block">
                        View Product
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-1 px-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <h3 className="text-xl font-bold uppercase leading-tight group-hover:text-gray-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-md font-black text-black">
                        ${product.price}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
