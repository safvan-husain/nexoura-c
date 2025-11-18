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
    // Card width is 30%, so positions: 10%, 35%, 60% (tighter spacing)
    const getPosition = (index: number, animState: 'idle' | 'next' | 'prev') => {
        if (animState === 'idle') {
            // Default idle positions (percentage-based with tighter spacing)
            if (index === 0) return { x: '10%', y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: '10%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 2) return { x: '35%', y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 3) return { x: '60%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 4) return { x: '60%', y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
        }

        if (animState === 'next') {
            // Next: shift right (reversed - items move right when going to next)
            if (index === 0) return { x: '10%', y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: '10%', y: 12, scale: 0.35, zIndex: 5, opacity: 0.7 };
            if (index === 2) return { x: '10%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 3) return { x: '35%', y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 4) return { x: '60%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
        }

        if (animState === 'prev') {
            // Prev: shift left (reversed - items move left when going to previous)
            if (index === 0) return { x: '10%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 1) return { x: '35%', y: 0, scale: 1, zIndex: 50, opacity: 1 };
            if (index === 2) return { x: '60%', y: 4, scale: .55, zIndex: 20, opacity: 0.85 };
            if (index === 3) return { x: '60%', y: 12, scale: 0.35, zIndex: 5, opacity: 0.7 };
            if (index === 4) return { x: '10%', y: 12, scale: 0.4, zIndex: 5, opacity: 0 };
        }

        return { x: '10%', y: 0, scale: 1, zIndex: 10, opacity: 0 };
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }


    return (
        <div className="w-full flex flex-col">
            {/* Product carousel container */}
            <div className="relative w-full h-full pt-12">
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
                            className={`absolute top-8 md:top-16 w-[30%] aspect-[3/4] cursor-pointer ${i == 0 && direction !== "prev" ? "hidden" : ""} ${i == 4 && direction !== "next" ? "hidden" : ""}`}
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

                                {/* Floor shadow for each product */}
                                <div
                                    className="absolute w-[80%] h-8 bg-black/30 blur-xl rounded-full"
                                    style={{
                                        // transform: `translateX(-50%) scale(${currentPos.scale})`,
                                        opacity: currentPos.opacity * 0.6
                                    }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            {/* <div>
                <motion.div
                    key={centerProduct.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        duration: 8.8
                    }}
                    className="text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {centerProduct.name}
                    </h2>
                    <p className="text-xl md:text-2xl font-semibold text-blue-600 mt-2">
                        ${centerProduct.price.toFixed(2)}
                    </p>
                </motion.div>
            </div> */}
        </div>
    );
}