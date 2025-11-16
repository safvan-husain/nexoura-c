'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type ProductCrouselProps = {
    products: { img: string, name: string, price: number, id: number }[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void
}

export function ProductCrousel({ products, currentIndex, setCurrentIndex }: ProductCrouselProps) {
    const [direction, setDirection] = useState<'next' | 'prev' | 'idle'>('idle');
    const [displayProducts, setDisplayProducts] = useState(products.slice(0, 5));
    const prevIndexRef = useRef(currentIndex);
    const isAnimatingRef = useRef(false);

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
        if (isAnimatingRef.current || products.length < 2) return;

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

        isAnimatingRef.current = true;
        setDirection(animDirection);

        // After animation completes, reset to idle
        setTimeout(() => {
            setDirection('idle');
            isAnimatingRef.current = false;
        }, 800);

        prevIndexRef.current = currentIndex;
    }, [currentIndex, products.length]);

    // Get position for a slot index based on current animation state
    // Using percentage-based positioning for responsive layout
    // Card width is 30%, so positions: 0%, 35%, 70% (30% + 5% gap between cards)
    const getPosition = (index: number, animState: 'idle' | 'next' | 'prev') => {
        if (animState === 'idle') {
            // Default idle positions (percentage-based with spacing)
            if (index === 0) return { x: '0%', y: 8, scale: 0.5, zIndex: 10, opacity: 0 };
            if (index === 1) return { x: '0%', y: 0, scale: .7, zIndex: 40, opacity: 1 };
            if (index === 2) return { x: '35%', y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 3) return { x: '70%', y: 0, scale: .7, zIndex: 30, opacity: 1 };
            if (index === 4) return { x: '70%', y: 8, scale: 0.5, zIndex: 9, opacity: 0 };
        }

        if (animState === 'next') {
            // Next: shift right (reversed - items move right when going to next)
            if (index === 0) return { x: '0%', y: 8, scale: 0.5, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: '0%', y: 8, scale: 0.4, zIndex: 10, opacity: 1 };
            if (index === 2) return { x: '0%', y: 0, scale: .7, zIndex: 40, opacity: 1 };
            if (index === 3) return { x: '35%', y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 4) return { x: '70%', y: 0, scale: .7, zIndex: 40, opacity: 1 };
        }

        if (animState === 'prev') {
            // Prev: shift left (reversed - items move left when going to previous)
            if (index === 0) return { x: '0%', y: 0, scale: .7, zIndex: 40, opacity: 1 };
            if (index === 1) return { x: '35%', y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 2) return { x: '70%', y: 0, scale: .7, zIndex: 30, opacity: 1 };
            if (index === 3) return { x: '70%', y: 8, scale: 0.4, zIndex: 9, opacity: 0 };
            if (index === 4) return { x: '0%', y: 8, scale: 0.5, zIndex: 0, opacity: 0 };
        }

        return { x: '0%', y: 0, scale: 1, zIndex: 10, opacity: 0 };
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    return (
        <div className="w-full min-h-[400px] flex items-center justify-center p-4 md:p-8">
            <div className="relative w-full h-[400px] md:h-[500px] max-w-4xl">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {displayProducts.map((product, i) => {
                    const currentPos = getPosition(i, direction);
                    const bgColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500'];
                    const bgColor = bgColors[i % bgColors.length];

                    return (
                        <motion.div
                            key={product.id}
                            animate={{
                                left: currentPos.x,
                                y: currentPos.y,
                                scale: currentPos.scale,
                                opacity: currentPos.opacity
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            style={{ zIndex: currentPos.zIndex }}
                            className={`absolute top-8 md:top-12 w-[30%] aspect-[3/4] rounded-2xl shadow-xl ${bgColor} overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow ${i == 0 && direction === "next" ? "hidden" : ""} ${i == 4 && direction === "prev" ? "hidden" : ""}`}
                            onClick={() => {
                                const originalIndex = products.findIndex(p => p.id === product.id);
                                if (originalIndex >= 0) setCurrentIndex(originalIndex);
                            }}
                        >
                            <div className="relative w-full h-[55%]">
                                {product.img.length > 0 ? (
                                    <Image
                                        src={product.img}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400 text-xs md:text-sm">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 md:p-3">
                                <h3 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm md:text-base font-bold text-blue-600">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}