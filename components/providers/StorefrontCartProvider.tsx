'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useStorefrontSession } from './StorefrontSessionProvider';
import { Cart, CartItem } from '@/lib/cart/model/cart.model';
import { useToast } from '@/components/ui/Toast';
import { HandledApiError, handleApiError } from '@/lib/utils/api-error-handler';

interface StorefrontCartContextType {
    items: CartItem[];
    isLoading: boolean;
    addToCart: (productId: string, selectedVariantItemIds?: string[], quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, selectedVariantItemIds: string[], quantity: number) => Promise<void>;
    removeFromCart: (productId: string, selectedVariantItemIds?: string[]) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    subtotal: number; // Note: We might need product data to calculate this accurately, but for now we'll just provide the count
}

const StorefrontCartContext = createContext<StorefrontCartContextType | undefined>(undefined);

function normalizeVariantItemIds(ids: string[] = []): string {
    return [...ids].sort().join(',');
}

export function StorefrontCartProvider({ children }: { children: React.ReactNode }) {
    const { session, isLoading: sessionLoading } = useStorefrontSession();
    const { showToast } = useToast();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch('/api/storefront/cart');
                if (res.ok) {
                    const data = await res.json();
                    setItems(data?.items || []);
                } else if (res.status === 401) {
                    // Unauthorized is expected if no session yet, just clear items
                    setItems([]);
                } else {
                    console.error('Failed to fetch cart:', res.status, res.statusText);
                    // Optionally show a toast here, but we don't want to spam if it's a persistent error
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!sessionLoading) {
            fetchCart();
        }
    }, [session?.id, sessionLoading]);

    const addToCart = async (productId: string, selectedVariantItemIds: string[] = [], quantity: number = 1) => {
        const normalized = normalizeVariantItemIds(selectedVariantItemIds);
        const previousItems = [...items];

        // Optimistic update
        const existingIndex = items.findIndex(
            item =>
                item.productId === productId &&
                normalizeVariantItemIds(item.selectedVariantItemIds) === normalized
        );

        if (existingIndex !== -1) {
            setItems(items.map((item, index) =>
                index === existingIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setItems([...items, { productId, selectedVariantItemIds, quantity, createdAt: new Date().toISOString() }]);
        }

        try {
            const res = await fetch('/api/storefront/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, selectedVariantItemIds, quantity }),
            });

            if (!res.ok) {
                setItems(previousItems);
                await handleApiError(res, showToast);
            } else {
                const data = await res.json();
                setItems(data?.items || []);
                showToast('Added to cart', 'success');
            }
        } catch (error) {
            setItems(previousItems);
            if (error instanceof HandledApiError) return;
            console.error('Cart error:', error);
            showToast('Something went wrong', 'error');
        }
    };

    const updateQuantity = async (productId: string, selectedVariantItemIds: string[] = [], quantity: number) => {
        const normalized = normalizeVariantItemIds(selectedVariantItemIds);
        const previousItems = [...items];

        // Optimistic update
        setItems(items.map(item => {
            if (item.productId === productId && normalizeVariantItemIds(item.selectedVariantItemIds) === normalized) {
                return { ...item, quantity };
            }
            return item;
        }));

        try {
            const res = await fetch('/api/storefront/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, selectedVariantItemIds, quantity }),
            });

            if (!res.ok) {
                setItems(previousItems);
                await handleApiError(res, showToast);
            } else {
                const data = await res.json();
                setItems(data?.items || []);
            }
        } catch (error) {
            setItems(previousItems);
            if (error instanceof HandledApiError) return;
            console.error('Cart error:', error);
            showToast('Something went wrong', 'error');
        }
    };

    const removeFromCart = async (productId: string, selectedVariantItemIds: string[] = []) => {
        const normalized = normalizeVariantItemIds(selectedVariantItemIds);
        const previousItems = [...items];

        // Optimistic update
        setItems(items.filter(
            item => !(item.productId === productId && normalizeVariantItemIds(item.selectedVariantItemIds) === normalized)
        ));

        try {
            const params = new URLSearchParams();
            params.append('productId', productId);
            selectedVariantItemIds.forEach(id => params.append('selectedVariantItemIds', id));

            const res = await fetch(`/api/storefront/cart?${params.toString()}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                setItems(previousItems);
                await handleApiError(res, showToast);
            } else {
                const data = await res.json();
                setItems(data?.items || []);
                showToast('Removed from cart', 'success');
            }
        } catch (error) {
            setItems(previousItems);
            if (error instanceof HandledApiError) return;
            console.error('Cart error:', error);
            showToast('Something went wrong', 'error');
        }
    };

    const clearCart = async () => {
        const previousItems = [...items];
        setItems([]);

        try {
            const res = await fetch('/api/storefront/cart', {
                method: 'DELETE',
            });

            if (!res.ok) {
                setItems(previousItems);
                await handleApiError(res, showToast);
            } else {
                const data = await res.json();
                setItems(data?.items || []);
                showToast('Cart cleared', 'success');
            }
        } catch (error) {
            setItems(previousItems);
            if (error instanceof HandledApiError) return;
            console.error('Cart error:', error);
            showToast('Something went wrong', 'error');
        }
    };

    return (
        <StorefrontCartContext.Provider
            value={{
                items,
                isLoading: isLoading || sessionLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                subtotal: 0 // Placeholder
            }}
        >
            {children}
        </StorefrontCartContext.Provider>
    );
}

export function useStorefrontCart() {
    const context = useContext(StorefrontCartContext);
    if (context === undefined) {
        throw new Error('useStorefrontCart must be used within a StorefrontCartProvider');
    }
    return context;
}
