'use client';

import { useState } from 'react';
import { Product } from './ProductViewer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { useStorefrontSession } from '@/components/providers/StorefrontSessionProvider';

interface ProductPurchaseActionProps {
    product: Product;
}

export default function ProductPurchaseAction({ product }: ProductPurchaseActionProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { session } = useStorefrontSession();

    return (
        <>
            <div className="flex gap-4">
                <button
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:scale-100"
                >
                    {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
                <button 
                    aria-label="Add to wishlist"
                    onClick={() => { /* TODO: implement wishlist functionality */ }}
                    className="w-14 h-14 flex items-center justify-center border-2 border-gray-100 rounded-2xl hover:border-black transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
                initialBillingDetails={session?.billingDetails}
            />
        </>
    );
}
