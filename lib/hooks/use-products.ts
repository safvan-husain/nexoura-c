'use client';

import { useState, useEffect } from 'react';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string; alt?: string }[];
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we are using Next.js 16 with 'use cache', 
        // we can't easily fetch from the server action without a proper setup.
        // For now, we will fetch from an internal API or just pass them down.
        // But the requirement is for a global search.
        // Let's assume we have a simple fetcher or we use a context.
        // To be safe and fast, I'll implement a simple fetch from our API if it exists.

        async function fetchProducts() {
            try {
                const res = await fetch('/api/products?limit=100');
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch products for search:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { products, loading };
}
