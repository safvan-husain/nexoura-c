'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/lib/hooks/use-products';
import { useStorefrontWishlist } from '@/components/providers/StorefrontWishlistProvider';
import { useStorefrontCart } from '@/components/providers/StorefrontCartProvider';
import { useStorefrontSession } from '@/components/providers/StorefrontSessionProvider';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5.68c.497 2.237.746 3.356.16 4.238-.588.883-1.734.883-4.026.883H9.497c-2.292 0-3.439 0-4.026-.883-.587-.882-.337-2.001.16-4.238l1.263-5.68c.189-.85.284-1.275.547-1.571.264-.296.67-.296 1.481-.296h8.156c.812 0 1.217 0 1.48.296.264.296.359.721.548 1.571Z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

export function NavbarClient() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { products } = useProducts();
    const { wishlistCount } = useStorefrontWishlist();
    const { cartCount } = useStorefrontCart();
    const { session, refreshSession } = useStorefrontSession();

    const isHomePage = pathname === '/';
    const isOverlayOpen = searchParams.get('view') === 'overlay';
    const showNavSearch = !isHomePage || isOverlayOpen;

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5);
    }, [products, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchActive(false);
                setSearchQuery('');
            }
        };

        if (isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside);
            inputRef.current?.focus();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchActive]);

    const handleProductClick = (slug: string) => {
        router.push(`/products/${slug}`);
        setIsSearchActive(false);
        setSearchQuery('');
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            await refreshSession();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="relative z-[110] bg-transparent border-b border-gray-400/70">
            {/* Flash Sale Banner */}
            <div className="w-full bg-black text-white text-center py-2 text-xs sm:text-sm tracking-widest uppercase font-medium">
                ✦ Flash Sale — <span className="font-bold">50% Off</span> Everything ✦
            </div>
            <div className="relative flex mx-auto h-16 items-center justify-center backdrop-blur-sm px-4 sm:px-6 lg:px-8">
                {/* ORIGINAL CENTERED LAYOUT (Hidden on Mobile) */}
                {/* We use the exact structure from the original file for desktop */}
                {/* Desktop Layout - Using grid for perfect centering of the logo regardless of link lengths */}
                <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-12 font-semibold w-full">
                    {/* Left Links */}
                    <div className="flex justify-end gap-6 text-gray-600 hover:text-black">
                        <Link href="/" className="uppercase transition-colors">Women</Link>
                        <Link href="/men" className="uppercase transition-colors">Men</Link>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="text-3xl font-semibold leading-tight text-gray-900 uppercase whitespace-nowrap">
                        EZRRAH
                    </Link>

                    {/* Right Links */}
                    <div className="flex gap-6 text-gray-600 hover:text-black">
                        <Link href="/wishlist" className="uppercase transition-colors relative">
                            Wishlist
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/products" className="uppercase transition-colors">Products</Link>
                    </div>
                </div>

                {/* MOBILE LAYOUT START */}
                {/* Logo Left-Aligned on Mobile */}
                <div className="md:hidden absolute left-4 flex items-center">
                    <Link href="/" className="text-2xl font-bold leading-tight text-gray-900 uppercase">
                        EZRRAH
                    </Link>
                </div>
                {/* MOBILE LAYOUT END */}


                {/* RIGHT SIDE ABSOLUTE ICONS */}
                <div className="absolute right-4 md:right-8 flex items-center gap-5">
                    {/* Desktop Only Icons */}
                    <div className="hidden md:flex items-center gap-5">
                        {showNavSearch && (
                            <div className="relative" ref={searchRef}>
                                <AnimatePresence mode="wait">
                                    {!isSearchActive ? (
                                        <motion.button
                                            key="search-icon"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => { setIsSearchActive(true); console.log("search icon clicked") }}
                                            className="text-gray-600 hover:text-black transition-colors"
                                            aria-label="Search"
                                        >
                                            <SearchIcon />
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            key="search-input"
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 240, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="flex items-center bg-gray-100 rounded-full px-4 py-2"
                                        >
                                            <div className="text-gray-400 mr-2">
                                                <SearchIcon />
                                            </div>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="bg-transparent border-none focus:outline-none text-sm w-full text-black placeholder:text-gray-400"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Dropdown Results */}
                                <AnimatePresence>
                                    {isSearchActive && filteredProducts.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 right-0 w-[300px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[120]"
                                        >
                                            <div className="py-2">
                                                {filteredProducts.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        onClick={() => handleProductClick(product.slug)}
                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        {product.images?.[0]?.url && (
                                                            <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                                                <img
                                                                    src={product.images[0].url}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">${product.price}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <Link href="/wishlist" className="text-gray-600 hover:text-black transition-colors relative" aria-label="Wishlist">
                            <HeartIcon />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/account/orders" className="text-gray-600 hover:text-black transition-colors" aria-label="Orders">
                            <PackageIcon />
                        </Link>
                        {session?.userId ? (
                            <div className="flex items-center gap-4">
                                <Link href="/account" className="text-gray-600 hover:text-black transition-colors" aria-label="Account">
                                    <UserIcon />
                                </Link>
                                <button onClick={handleLogout} className="text-xs uppercase text-gray-500 hover:text-black">Logout</button>
                            </div>
                        ) : (
                            <Link href="/account/login" className="text-gray-600 hover:text-black transition-colors" aria-label="Login">
                                <UserIcon />
                            </Link>
                        )}
                    </div>

                    {/* Always Visible: Cart */}
                    <Link href="/cart" className="text-gray-600 hover:text-black transition-colors relative" aria-label="Cart">
                        <CartIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Only: Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-600 hover:text-black transition-colors ml-2"
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden absolute w-full z-[120] shadow-xl top-16 left-0"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 hover:text-black text-center uppercase">
                                Women
                            </Link>
                            <Link href="/men" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 hover:text-black text-center uppercase">
                                Men
                            </Link>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 hover:text-black text-center uppercase">
                                Wishlist
                            </Link>
                            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 hover:text-black text-center uppercase">
                                Products
                            </Link>

                            {/* Mobile Menu Icons Panel */}
                            <div className="flex justify-center gap-10 pt-6 border-t border-gray-100">
                                {showNavSearch && (
                                    <div className="flex flex-col items-center">
                                        <AnimatePresence mode="wait">
                                            {!isSearchActive ? (
                                                <button
                                                    onClick={() => setIsSearchActive(true)}
                                                    className="flex flex-col items-center gap-2 text-gray-600 hover:text-black"
                                                >
                                                    <SearchIcon />
                                                    <span className="text-xs uppercase tracking-wide">Search</span>
                                                </button>
                                            ) : (
                                                <motion.div
                                                    initial={{ width: 0, opacity: 0 }}
                                                    animate={{ width: 140, opacity: 1 }}
                                                    className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                                                >
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="..."
                                                        className="bg-transparent border-none focus:outline-none text-xs w-full text-black"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                                <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-black">
                                    <HeartIcon />
                                    <span className="text-xs uppercase tracking-wide">Wishlist</span>
                                </button>
                                <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 text-gray-600 hover:text-black">
                                    <PackageIcon />
                                    <span className="text-xs uppercase tracking-wide">Orders</span>
                                </Link>
                                {/* Cart is already visible in header, but user said 'show all these options' on expand. 
                        Including it here too isn't bad for consistency, or we can skip it. 
                        I'll include it. 
                     */}
                                <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-black">
                                    <CartIcon />
                                    <span className="text-xs uppercase tracking-wide">Cart</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
