'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    
    // Sync displayProducts when products prop changes
    useEffect(() => {
        setDisplayProducts(products.slice(0, 5));
    }, [products]);

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
            // Next: shift left (0→1, 1→2, 2→3, 3→4, 4 disappears)
            if (index === 0) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 1) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 2) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
            if (index === 3) return { x: slotX[3], y: 8, scale: 0.92, zIndex: 9, opacity: 1 };
            if (index === 4) return { x: slotX[3], y: 8, scale: 0.01, zIndex: 5, opacity: 0 };
        }
        
        if (animState === 'prev') {
            // Prev: shift right (4→3, 3→2, 2→1, 1→0, 0 disappears)
            if (index === 0) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 5, opacity: 0 };
            if (index === 1) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 10, opacity: 0 };
            if (index === 2) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 3) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 4) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
        }
        
        return { x: 0, y: 0, scale: 1, zIndex: 10, opacity: 1 };
    };

    const handleNext = () => {
        if (direction !== 'idle' || displayProducts.length < 2) return;
        
        setDirection('next');
        
        // After animation completes, snap to idle without animation
        setTimeout(() => {
            setShouldAnimate(false);
            setDirection('idle');
            
            // Re-enable animation after state update
            setTimeout(() => setShouldAnimate(true), 50);
        }, 800);
    };

    const handlePrev = () => {
        if (direction !== 'idle' || displayProducts.length < 2) return;
        
        setDirection('prev');
        
        // After animation completes, snap to idle without animation
        setTimeout(() => {
            setShouldAnimate(false);
            setDirection('idle');
            
            // Re-enable animation after state update
            setTimeout(() => setShouldAnimate(true), 50);
        }, 800);
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    return (
        <div className="w-full min-h-[320px] flex items-center justify-center p-8">
            <div className="relative w-[720px] h-[220px]">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {displayProducts.map((product, i) => {
                    const currentPos = getPosition(i, direction);

                    return (
                        <motion.div
                            key={product.id}
                            animate={currentPos}
                            transition={shouldAnimate ? { type: "spring", stiffness: 300, damping: 28 } : { duration: 0 }}
                            style={{ width: boxWidth, height: boxHeight, zIndex: currentPos.zIndex }}
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

                {/* Navigation Buttons */}
                <div className="absolute left-2 bottom-2 flex gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={direction !== 'idle'}
                        className="px-4 py-2 rounded-full bg-gray-900 text-white shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={direction !== 'idle'}
                        className="px-4 py-2 rounded-full bg-gray-900 text-white shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}