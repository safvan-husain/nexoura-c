'use client';

import { useState } from 'react';
import { Product } from './ProductViewer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { useStorefrontSession } from '@/components/providers/StorefrontSessionProvider';
import { useStorefrontWishlist } from '@/components/providers/StorefrontWishlistProvider';
import { useStorefrontCart } from '@/components/providers/StorefrontCartProvider';
import { cn } from '@/lib/utils';

interface ProductPurchaseActionProps {
    product: Product;
}

export default function ProductPurchaseAction({ product }: ProductPurchaseActionProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { session } = useStorefrontSession();
    const { toggleWishlistItem, isInWishlist } = useStorefrontWishlist();
    const { addToCart } = useStorefrontCart();

    const isWishlisted = isInWishlist(product._id);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCheckoutOpen(true)}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:scale-100"
                    >
                        {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                    </button>
                    <button
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={() => toggleWishlistItem(product._id)}
                        className={cn(
                            "w-14 h-14 flex items-center justify-center border-2 rounded-2xl transition-all active:scale-95",
                            isWishlisted
                                ? "bg-black border-black text-white"
                                : "border-gray-100 text-black hover:border-black"
                        )}
                    >
                        <svg
                            className="w-6 h-6"
                            fill={isWishlisted ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock <= 0}
                    className="w-full border-2 border-black text-black h-14 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-400"
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
