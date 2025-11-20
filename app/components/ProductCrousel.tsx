'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type ProductCrouselProps = {
    products: { img: string, name: string, price: number, id: number }[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void,
    spacingStep?: number,
    centerPosition?: number
}

export function ProductCrousel({
    products,
    currentIndex,
    setCurrentIndex,
    spacingStep = 16,
    centerPosition = 40
}: ProductCrouselProps) {
    const [direction, setDirection] = useState<'next' | 'prev' | 'idle'>('idle');
    const [displayProducts, setDisplayProducts] = useState(products.slice(0, 5));
    const prevIndexRef = useRef(currentIndex);
    const slotPositions = Array.from({ length: 5 }, (_, idx) => centerPosition + (idx - 2) * spacingStep);
    const extendedLeft = centerPosition - 3 * spacingStep;
    const extendedRight = centerPosition + 3 * spacingStep;

    // Sync displayProducts centered around currentIndex
    useEffect(() => {
        if (products.length === 0) {
            setDisplayProducts([]);
            return;
        }

        const totalProducts = products.length;
        const displayCount = Math.min(5, totalProducts);
        const newDisplay = [];

        // Calculate positions: currentIndex should be at position 2 (3rd element, 0-indexed)
        // So we need 2 items before currentIndex and 2 items after
        for (let i = 0; i < displayCount; i++) {
            const offset = i - 2; // -2, -1, 0, 1, 2
            let index = (currentIndex + offset + totalProducts) % totalProducts;
            newDisplay.push(products[index]);
        }

        setDisplayProducts(newDisplay.reverse());
    }, [products, currentIndex]);

    // Watch for currentIndex changes and trigger animation
    useEffect(() => {
        if (products.length < 2) return;

        const prevIndex = prevIndexRef.current;
        const totalProducts = products.length;

        if (prevIndex === currentIndex) return;

        // Determine direction based on index change
        let animDirection: 'next' | 'prev';

        // Handle wrapping (e.g., 0 -> last or last -> 0)
        if (prevIndex === 0 && currentIndex === totalProducts - 1) {
            animDirection = 'prev';
        } else if (prevIndex === totalProducts - 1 && currentIndex === 0) {
            animDirection = 'next';
        } else {
            animDirection = currentIndex > prevIndex ? 'next' : 'prev';
        }

        setDirection(animDirection);

        // After animation completes, reset to idle
        const timer = setTimeout(() => {
            setDirection('idle');
        }, 50);

        prevIndexRef.current = currentIndex;

        return () => clearTimeout(timer);
    }, [currentIndex, products.length]);

    // Get position for a slot index based on current animation state
    // Using percentage-based positioning for responsive layout
    // Card width is 30%, so positions derive from centerPosition & spacingStep (dynamic spacing)
    const getPosition = (index: number, animState: 'idle' | 'next' | 'prev') => {
        if (animState === 'idle') {
            // Default idle positions (percentage-based with tighter spacing)
            if (index === 0) return { x: `${slotPositions[1]}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: `${slotPositions[1]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 2) return { x: `${slotPositions[2]}%`, y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 3) return { x: `${slotPositions[3]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 4) return { x: `${slotPositions[4]}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
        }

        if (animState === 'next') {
            // Next: shift right (reversed - items move right when going to next)
            if (index === 0) return { x: `${slotPositions[1]}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: `${Math.max(extendedLeft, slotPositions[0] - spacingStep)}%`, y: 12, scale: 0.35, zIndex: 5, opacity: 0.7 };
            if (index === 2) return { x: `${slotPositions[1]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 3) return { x: `${slotPositions[2]}%`, y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 4) return { x: `${slotPositions[3]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
        }

        if (animState === 'prev') {
            // Prev: shift left (reversed - items move left when going to previous)
            if (index === 0) return { x: `${slotPositions[1]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 1) return { x: `${slotPositions[2]}%`, y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 2) return { x: `${slotPositions[3]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 3) return { x: `${Math.min(extendedRight, slotPositions[4] + spacingStep)}%`, y: 12, scale: 0.35, zIndex: 5, opacity: 0.7 };
            if (index === 4) return { x: `${extendedRight}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
        }

        return { x: '0%', y: 0, scale: 1, zIndex: 10, opacity: 0 };
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }


    return (
        <div className="w-full flex flex-col ">
            {/* Product carousel container */}
            <div className="relative w-full pb-12 min-h-screen bg-blue-500 overflow-hidden">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {displayProducts.map((product, i) => {
                    const currentPos = getPosition(i, direction);

                    return (
                        <motion.div
                            key={product.id}
                            animate={{
                                left: currentPos.x,
                                y: currentPos.y,
                                scale: currentPos.scale,
                                opacity: currentPos.opacity
                            }}
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                            style={{ zIndex: currentPos.zIndex }}
                            className={`absolute top-4 md:top-8 w-[30%] aspect-[3/4] cursor-pointer ${i == 0 && direction !== "prev" ? "hidden" : ""} ${i == 4 && direction !== "next" ? "hidden" : ""}`}
                            onClick={() => {
                                const originalIndex = products.findIndex(p => p.id === product.id);
                                if (originalIndex >= 0) setCurrentIndex(originalIndex);
                            }}
                        >
                            {/* Product card with shadow */}
                            <div className="relative w-full h-full">
                                {/* Product image */}
                                <div className="relative w-full h-full drop-shadow-2xl">
                                    {product.img.length > 0 ? (
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="bg-white/80 backdrop-blur-sm w-full h-full flex items-center justify-center rounded-lg">
                                            <span className="text-gray-400 text-xs md:text-sm">No image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Floor shadow for each product - positioned to stay within card bounds */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/30 blur-xl rounded-full"
                                    style={{
                                        bottom: '4px',
                                        opacity: currentPos.opacity * 0.6
                                    }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
                <div className='absolute bottom-40 left-2/3 -translate-x-2/3 w-full h-12'>
                    {/* Buy buttons anchored to bottom of carousel area */}
                    <div className="flex items-center justify-center gap-6">
                        <button className="px-8 py-3 rounded-2xl bg-black text-white font-semibold shadow-md hover:bg-gray-800">BUY NOW</button>
                        <button className="px-8 py-3 rounded-2xl bg-white text-gray-900 font-semibold shadow-sm border border-gray-200 hover:bg-gray-50">ADD TO CART</button>
                    </div>
                    <div className="flex items-center justify-center gap-24 text-xs text-gray-600">
                        <span>Free shipping</span>
                        <span>30-day returns</span>
                    </div>
                </div>
            </div>


        </div>
    );
}