'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefrontWishlist } from '@/components/providers/StorefrontWishlistProvider';
import { useProducts } from '@/lib/hooks/use-products';
import ProductCard from '@/components/products/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistClient() {
    const { items, isLoading: wishlistLoading } = useStorefrontWishlist();
    const { products, loading: productsLoading } = useProducts();

    const isLoading = wishlistLoading || productsLoading;

    const wishlistedProducts = products.filter(product =>
        items.some(item => item.productId === product._id)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black">
                    Your Wishlist
                </h1>
                <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
                </p>
            </header>

            <AnimatePresence mode="wait">
                {items.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="mb-6 p-6 rounded-full bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">Save your favorite pieces here to keep track of what you love.</p>
                        <Link
                            href="/products"
                            className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
                    >
                        {wishlistedProducts.map((product, index) => (
                            <ProductCard key={product._id} product={product as any} index={index} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
