'use client';

import { useState, useEffect, useMemo } from 'react';
import BillingDetailsForm from './BillingDetailsForm';
import { BillingDetails } from '@/lib/order/billing-details.schema';
import { Product } from '@/components/products/ProductViewer';
import { motion, AnimatePresence } from 'framer-motion';

export interface CheckoutItem {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    selectedOptions?: Record<string, string>;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    items?: CheckoutItem[];
    initialBillingDetails?: Partial<BillingDetails>;
}

export default function CheckoutModal({ isOpen, onClose, product, items, initialBillingDetails }: CheckoutModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const displayItems: CheckoutItem[] = useMemo(() => {
        if (items && items.length > 0) return items;
        if (product) {
            return [{
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0]?.url,
                quantity: 1,
                unitPrice: product.price,
            }];
        }
        return [];
    }, [items, product]);

    const totalAmount = useMemo(() => {
        return displayItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    }, [displayItems]);

    const handleCheckout = async (details: BillingDetails) => {
        if (displayItems.length === 0) {
            setError('No items to checkout');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Save billing details to session
            const saveResp = await fetch('/api/storefront/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
            });

            if (!saveResp.ok) {
                const data = await saveResp.json();
                throw new Error(data.message || 'Failed to save billing details');
            }

            // 2. Initiate Stripe Checkout
            const checkoutResp = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: displayItems }),
            });

            const data = await checkoutResp.json();
            if (!checkoutResp.ok) {
                throw new Error(data.message || 'Failed to initiate checkout');
            }

            // 3. Redirect to Stripe
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'An unexpected error occurred during checkout.');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Left Side: Product Summary (Hidden on small screens) */}
                    <div className="hidden md:block w-1/3 bg-gray-50 p-8 border-r border-gray-100 overflow-y-auto">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Order Summary</h3>

                            <div className="space-y-4">
                                {displayItems.map((item, idx) => (
                                    <div key={`${item.productId}-${idx}`} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm relative">
                                            {item.productImage && (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {item.quantity > 1 && (
                                                <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                                    x{item.quantity}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm uppercase tracking-tight truncate">{item.productName}</p>
                                            <p className="text-gray-400 text-xs">${item.unitPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Calculated at Next Step</span>
                                </div>
                                <div className="flex justify-between items-center text-xl mt-6 pt-6 border-t-2 border-dashed border-gray-200">
                                    <span className="font-black uppercase text-[10px] tracking-[0.3em]">Total</span>
                                    <span className="font-black">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Checkout</h2>
                                <p className="text-sm text-gray-400">Enter your billing and shipping details</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{error}</p>
                            </div>
                        )}

                        <BillingDetailsForm
                            initialData={initialBillingDetails}
                            onSubmit={handleCheckout}
                            isLoading={isLoading}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
