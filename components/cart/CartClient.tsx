'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useStorefrontCart } from '@/components/providers/StorefrontCartProvider';
import { useProducts } from '@/lib/hooks/use-products';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';
import { useStorefrontSession } from '@/components/providers/StorefrontSessionProvider';
import CheckoutModal from '@/components/checkout/CheckoutModal';

const PLACEHOLDER_IMAGE = "https://placehold.co/600x600/f3f4f6/111827?text=Nexoura";

export default function CartClient() {
    const { items, updateQuantity, removeFromCart, clearCart, isLoading: cartLoading, cartCount } = useStorefrontCart();
    const { products, loading: productsLoading } = useProducts();
    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
    const { session } = useStorefrontSession();
    const router = useRouter();

    const isLoading = cartLoading || productsLoading;

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    const cartDetails = useMemo(() => {
        return items.map(item => {
            const product = products.find(p => p._id === item.productId);
            return {
                ...item,
                product,
                isUnavailable: !product
            };
        });
    }, [items, products]);

    const subtotal = useMemo(() => {
        return cartDetails.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity;
        }, 0);
    }, [cartDetails]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black">
                        Your Cart
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm">
                        {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in bag
                    </p>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-2"
                    >
                        Clear bag
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <AnimatePresence mode="popLayout">
                        {cartDetails.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]"
                            >
                                <div className="mb-6 p-6 rounded-full bg-gray-50">
                                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 mb-2">Your cart is empty</h2>
                                <p className="text-gray-500 mb-8 max-w-sm">Discover our latest collection and find something you love.</p>
                                <Link
                                    href="/products"
                                    className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                >
                                    Start Shopping
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {cartDetails.map((item) => (
                                    <motion.div
                                        key={`${item.productId}-${item.selectedVariantItemIds.join('-')}`}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex gap-6 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 group"
                                    >
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                                            <img
                                                src={item.product?.images?.[0]?.url || PLACEHOLDER_IMAGE}
                                                alt={item.product?.name || 'Product Image'}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={cn(
                                                        "text-xl font-bold uppercase tracking-tight line-clamp-1",
                                                        item.isUnavailable ? "text-red-500" : "text-gray-900"
                                                    )}>
                                                        {item.isUnavailable ? 'Product Unavailable' : item.product?.name}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">
                                                        {item.isUnavailable ? 'This item is no longer available' : `$${item.product?.price?.toFixed(2)}`}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.productId, item.selectedVariantItemIds)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {!item.isUnavailable && (
                                                <div className="flex justify-between items-center mt-auto pt-4">
                                                    <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.selectedVariantItemIds, Math.max(1, item.quantity - 1))}
                                                            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.selectedVariantItemIds, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <p className="text-lg font-black text-black">
                                                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-black text-white p-8 rounded-[2.5rem] sticky top-24 shadow-2xl shadow-black/20">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 uppercase tracking-widest text-xs font-bold">
                                <span>Subtotal</span>
                                <span className="text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 uppercase tracking-widest text-xs font-bold">
                                <span>Shipping</span>
                                <span className="text-white">Calculated at next step</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                                <span className="text-3xl font-black">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cartDetails.length === 0}
                            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white"
                        >
                            Checkout
                        </button>

                        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest mt-6 leading-relaxed">
                            Secured checkout powered by Stripe.
                            <br />
                            Taxes and shipping calculated at checkout.
                        </p>
                    </div>
                </div>
            </div>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={cartDetails.map(item => ({
                    productId: item.productId,
                    productName: item.product?.name || 'Product',
                    productImage: item.product?.images?.[0]?.url,
                    quantity: item.quantity,
                    unitPrice: item.product?.price || 0,
                    // Note: selectedOptions should be handled here if we want them in Stripe
                    // For now keeping it simple as items DTO supports optional selectedOptions
                }))}
                initialBillingDetails={session?.billingDetails}
            />
        </div>
    );
}
