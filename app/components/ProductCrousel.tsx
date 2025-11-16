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
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const prevIndexRef = useRef(currentIndex);
    const isAnimatingRef = useRef(false);

    // Sync displayProducts centered around currentIndex
    useEffect(() => {
        setTimeout(() => {
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
        }, 50);

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

        // After animation completes, snap to idle without animation
        setTimeout(() => {
            setShouldAnimate(false);
            setDisplayProducts(prev => {
                const newArray = [...prev];
                if (animDirection === 'next') {
                    const first = newArray.shift()!;
                    newArray.push(first);
                } else {
                    const last = newArray.pop()!;
                    newArray.unshift(last);
                }
                return newArray;
            });
            setDirection('idle');

            // Re-enable animation after state update
            setTimeout(() => {
                setShouldAnimate(true);
                isAnimatingRef.current = false;
            }, 50);
        }, 800);

        prevIndexRef.current = currentIndex;
    }, [currentIndex, products.length]);

    // Base positions (px) for five slots (left-to-right)
    const slotX = [0, 140, 280, 420, 560];
    const boxWidth = 120;
    const boxHeight = 160;

    // Get position for a slot index based on current animation state
    const getPosition = (index: number, animState: 'idle' | 'next' | 'prev') => {
        if (animState === 'idle') {
            // Default idle positions
            if (index === 0) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 10, opacity: 0 };
            if (index === 1) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 2) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 3) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
            if (index === 4) return { x: slotX[3], y: 8, scale: 0.92, zIndex: 9, opacity: 1 };
        }

        if (animState === 'next') {
            // Next: shift right (reversed - items move right when going to next)
            if (index === 0) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 10, opacity: 0 };
            if (index === 2) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 3) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 4) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
        }

        if (animState === 'prev') {
            // Prev: shift left (reversed - items move left when going to previous)
            if (index === 0) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 1) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 2) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
            if (index === 3) return { x: slotX[3], y: 8, scale: 0.92, zIndex: 9, opacity: 1 };
            if (index === 4) return { x: slotX[3], y: 8, scale: 0.01, zIndex: 5, opacity: 0 };
        }

        return { x: slotX[1], y: 0, scale: 1, zIndex: 10, opacity: 0 };
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    return (
        <div className="w-full min-h-[320px] flex items-center justify-center p-8">
            <div className="relative w-[720px] h-[420px]">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {displayProducts.map((product, i) => {
                    const currentPos = getPosition(i, direction);

                    return (
                        <motion.div
                            key={product.id}
                            animate={currentPos}
                            transition={shouldAnimate ? { type: "spring", stiffness: 300, damping: 28 } : { duration: 0 }}
                            style={{ width: boxWidth, height: boxHeight, zIndex: currentPos.zIndex, opacity: 0 }}
                            className="absolute top-12 rounded-2xl shadow-xl bg-white overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
                            onClick={() => {
                                const originalIndex = products.findIndex(p => p.id === product.id);
                                if (originalIndex >= 0) setCurrentIndex(originalIndex);
                            }}
                        >
                            <div className="relative w-full h-24">
                                {product.img.length > 0 ? (
                                    <Image
                                        src={product.img}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <h3 className="text-xs font-semibold text-gray-800 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-bold text-blue-600">
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