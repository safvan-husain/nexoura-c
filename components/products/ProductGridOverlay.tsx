'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from './ProductViewer'
import ProductCard from './ProductCard'

interface ProductGridOverlayProps {
    products: Product[]
    isOpen: boolean
    onClose: () => void
}

export default function ProductGridOverlay({ products, isOpen, onClose }: ProductGridOverlayProps) {
    // Prevent body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 top-18 z-[100] bg-white overflow-y-auto"
                >
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        {/* ... existing header ... */}
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">
                                    Our Collection
                                </h2>
                                <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm">
                                    {products.length} Products Available
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="group flex items-center gap-2 p-3 hover:bg-black rounded-full transition-all duration-300"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white hidden sm:block">Close</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 group-hover:text-white"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>

                        {/* Bottom Spacer/Footer for the overlay */}
                        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col items-center gap-6 text-center">
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.3em]">Nexoura Premium Collection</p>
                            <div className="flex gap-8">
                                {['Instagram', 'Twitter', 'Facebook'].map(social => (
                                    <span key={social} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-black transition-colors">{social}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
