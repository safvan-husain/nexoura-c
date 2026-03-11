'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Calendar, Zap, BellRing } from 'lucide-react'
import { Product } from './ProductViewer'
import ProductCard from './ProductCard'
import TrustIndicators from './TrustIndicators'
import Footer from '../layout/Footer'

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
                    <div className="">
                        <div className='max-w-7xl mx-auto px-6 py-12'>
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

                            {/* Pre-Order Banner Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-16 bg-neutral-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group border border-white/10 shadow-2xl"
                            >
                                {/* Decorative background elements */}
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                                    <Sparkles strokeWidth={0.5} className="w-96 h-96" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                <div className="relative z-10 max-w-4xl mx-auto">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-8 backdrop-blur-md border border-white/10">
                                            <Sparkles className="w-4 h-4 text-yellow-400" />
                                            <span>Something Big Is Dropping!</span>
                                        </div>

                                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                                            Our exclusive collection<br className="hidden md:block" /> is finally arriving
                                        </h3>

                                        <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-2xl leading-relaxed">
                                            Pre-Orders start tomorrow. Be among the first to grab your favorite styles with an exclusive <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">20% Pre-Order Discount</span>.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white">
                                                <Gift className="w-6 h-6 text-pink-400" />
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">Surprise Gift</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">The first 10 customers will receive a special surprise gift! This is your chance to secure the newest trends before the official launch.</p>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white">
                                                <Calendar className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">Pre-Order Window</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed"><span className="text-white font-medium">Starts Tomorrow at 10:00 AM EST</span><br />Don't miss the 24-hour exclusive window.</p>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white">
                                                <Zap className="w-6 h-6 text-yellow-500" />
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">Very Limited</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">Limited time. Limited pieces. Collection will not be restocked once sold out during pre-order phase.</p>
                                        </div>
                                    </div>

                                    {/* <div className="flex justify-center">
                                        <button className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                            <BellRing className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                            Get Notified
                                        </button>
                                    </div> */}
                                </div>
                            </motion.div>

                            {/* Trust Indicators */}
                            <div className="mt-16">
                                <TrustIndicators />
                            </div>
                        </div>


                        {/* Footer Section */}
                        <div className="mt-24">
                            <Footer />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
