'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/lib/hooks/use-products';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);
    const { products, loading } = useProducts();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(q));
    }, [products, query]);

    const hasQuery = query.trim().length > 0;

    return (
        /* This page is intentionally only for mobile/tablet – desktop users are redirected away or it simply looks normal */
        <div className="min-h-screen bg-white flex flex-col lg:hidden">
            {/* Search Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 px-4 py-3">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                        aria-label="Go back"
                    >
                        <BackIcon />
                    </button>

                    {/* Search Input */}
                    <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2">
                        <span className="text-gray-400 flex-shrink-0">
                            <SearchIcon />
                        </span>
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search for products…"
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder:text-gray-400"
                            autoComplete="off"
                        />
                        {hasQuery && (
                            <button
                                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                                aria-label="Clear search"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Empty state – no query */}
                {!hasQuery && (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <SearchIcon />
                        </div>
                        <p className="text-lg font-semibold text-gray-900 mb-1">Search products</p>
                        <p className="text-sm text-gray-500">Type above to find what you&apos;re looking for</p>
                    </div>
                )}

                {/* Loading */}
                {hasQuery && loading && (
                    <div className="p-4 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No results */}
                {hasQuery && !loading && filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                        <p className="text-lg font-semibold text-gray-900 mb-1">No results found</p>
                        <p className="text-sm text-gray-500">
                            Try a different keyword or browse our{' '}
                            <Link href="/products" className="underline text-gray-700 font-medium">
                                products
                            </Link>
                        </p>
                    </div>
                )}

                {/* Results */}
                {hasQuery && !loading && filteredProducts.length > 0 && (
                    <div className="divide-y divide-gray-50">
                        <p className="px-4 py-3 text-xs text-gray-400 uppercase tracking-widest font-medium">
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                        {filteredProducts.map(product => (
                            <Link
                                key={product._id}
                                href={`/products/${product.slug}`}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                                {/* Product Image */}
                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    {product.images?.[0]?.url ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        {product.price !== undefined ? `$${product.price}` : ''}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
