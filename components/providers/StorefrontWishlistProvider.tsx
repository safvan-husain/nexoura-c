'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useStorefrontSession } from './StorefrontSessionProvider';
import { Wishlist, WishlistItem } from '@/lib/wishlist/model/wishlist.model';
import { useToast } from '@/components/ui/Toast';
import { HandledApiError, handleApiError } from '@/lib/utils/api-error-handler';

interface StorefrontWishlistContextType {
    items: WishlistItem[];
    isLoading: boolean;
    isInWishlist: (productId: string, selectedVariantItemIds?: string[]) => boolean;
    toggleWishlistItem: (productId: string, selectedVariantItemIds?: string[]) => Promise<void>;
    wishlistCount: number;
}

const StorefrontWishlistContext = createContext<StorefrontWishlistContextType | undefined>(undefined);

function normalizeVariantItemIds(ids: string[] = []): string {
    return [...ids].sort().join(',');
}

export function StorefrontWishlistProvider({ children }: { children: React.ReactNode }) {
    const { session, isLoading: sessionLoading } = useStorefrontSession();
    const { showToast } = useToast();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const wishlistCount = useMemo(() => items.length, [items]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await fetch('/api/storefront/wishlist');
                if (res.ok) {
                    const data = await res.json();
                    setItems(data.items || []);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!sessionLoading) {
            fetchWishlist();
        }
    }, [session, sessionLoading]);

    const isInWishlist = (productId: string, selectedVariantItemIds: string[] = []) => {
        const normalized = normalizeVariantItemIds(selectedVariantItemIds);
        return items.some(
            item =>
                item.productId === productId &&
                normalizeVariantItemIds(item.selectedVariantItemIds) === normalized
        );
    };

    const toggleWishlistItem = async (productId: string, selectedVariantItemIds: string[] = []) => {
        const normalized = normalizeVariantItemIds(selectedVariantItemIds);
        const exists = isInWishlist(productId, selectedVariantItemIds);

        // Optimistic update
        const previousItems = [...items];
        if (exists) {
            setItems(items.filter(
                item => !(item.productId === productId && normalizeVariantItemIds(item.selectedVariantItemIds) === normalized)
            ));
        } else {
            setItems([...items, { productId, selectedVariantItemIds, createdAt: new Date().toISOString() }]);
        }

        try {
            const method = exists ? 'DELETE' : 'POST';
            const res = await fetch('/api/storefront/wishlist', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, selectedVariantItemIds }),
            });

            if (!res.ok) {
                setItems(previousItems);
                await handleApiError(res, showToast);
            } else {
                const data = await res.json();
                setItems(data.items || []);
                showToast(
                    exists ? 'Removed from wishlist' : 'Added to wishlist',
                    'success'
                );
            }
        } catch (error) {
            setItems(previousItems);
            if (error instanceof HandledApiError) return;
            console.error('Wishlist error:', error);
            showToast('Something went wrong', 'error');
        }
    };

    return (
        <StorefrontWishlistContext.Provider
            value={{ items, isLoading: isLoading || sessionLoading, isInWishlist, toggleWishlistItem, wishlistCount }}
        >
            {children}
        </StorefrontWishlistContext.Provider>
    );
}

export function useStorefrontWishlist() {
    const context = useContext(StorefrontWishlistContext);
    if (context === undefined) {
        throw new Error('useStorefrontWishlist must be used within a StorefrontWishlistProvider');
    }
    return context;
}
