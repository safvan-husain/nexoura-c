'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

export function NavbarClient() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#2B2C31]">
            <div className="relative flex mx-auto h-16 items-center justify-center backdrop-blur-sm px-4 sm:px-6 lg:px-8">

                {/* ORIGINAL CENTERED LAYOUT (Hidden on Mobile) */}
                {/* We use the exact structure from the original file for desktop */}
                <div className="hidden md:flex flex-row items-center justify-center gap-12 font-semibold">
                    {/* Left Links */}
                    <div className="text-gray-200 hover:text-blue-600 flex gap-6">
                        <Link href="/" className="uppercase transition-colors">Women</Link>
                        <Link href="/men" className="uppercase transition-colors">Men</Link>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="text-3xl font-semibold leading-tight text-white uppercase whitespace-nowrap">
                        EZRRAH
                    </Link>

                    {/* Right Links */}
                    <div className="flex gap-6 text-gray-200 hover:text-blue-600">
                        <Link href="/" className="uppercase transition-colors">Whishlist</Link>
                        <Link href="/products" className="uppercase transition-colors">Products</Link>
                    </div>
                </div>

                {/* MOBILE LAYOUT START */}
                {/* Logo Left-Aligned on Mobile */}
                <div className="md:hidden absolute left-4 flex items-center">
                    <Link href="/" className="text-2xl font-bold leading-tight text-white uppercase">
                        EZRRAH
                    </Link>
                </div>
                {/* MOBILE LAYOUT END */}


                {/* RIGHT SIDE ABSOLUTE ICONS */}
                <div className="absolute right-4 md:right-8 flex items-center gap-5">
                    {/* Desktop Only Icons */}
                    <div className="hidden md:flex items-center gap-5">
                        <button className="text-gray-200 hover:text-white transition-colors" aria-label="Search">
                            <SearchIcon />
                        </button>
                        <button className="text-gray-200 hover:text-white transition-colors" aria-label="Wishlist">
                            <HeartIcon />
                        </button>
                    </div>

                    {/* Always Visible: Cart */}
                    <button className="text-gray-200 hover:text-white transition-colors" aria-label="Cart">
                        <CartIcon />
                    </button>

                    {/* Mobile Only: Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-200 hover:text-white transition-colors ml-2"
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
                        className="md:hidden bg-[#2B2C31] border-t border-gray-700 overflow-hidden absolute w-full z-50 shadow-xl top-16 left-0"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-200 hover:text-white text-center uppercase">
                                Women
                            </Link>
                            <Link href="/men" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-200 hover:text-white text-center uppercase">
                                Men
                            </Link>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-200 hover:text-white text-center uppercase">
                                Whishlist
                            </Link>
                            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-200 hover:text-white text-center uppercase">
                                Products
                            </Link>

                            {/* Mobile Menu Icons Panel */}
                            <div className="flex justify-center gap-10 pt-6 border-t border-gray-700">
                                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white">
                                    <SearchIcon />
                                    <span className="text-xs uppercase tracking-wide">Search</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white">
                                    <HeartIcon />
                                    <span className="text-xs uppercase tracking-wide">Wishlist</span>
                                </button>
                                {/* Cart is already visible in header, but user said 'show all these options' on expand. 
                        Including it here too isn't bad for consistency, or we can skip it. 
                        I'll include it. 
                     */}
                                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white">
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
