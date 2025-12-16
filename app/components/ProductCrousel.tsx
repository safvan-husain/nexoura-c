'use client'

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { InfiniteVerticalScroller } from "./InfiniteVerticalScroller";

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
    spacingStep = 39,
    centerPosition = 27
}: ProductCrouselProps) {
    const [direction, setDirection] = useState<'next' | 'prev' | 'idle'>('idle');
    const [displayProducts, setDisplayProducts] = useState(products.slice(0, 5));
    const prevIndexRef = useRef(currentIndex);
    const slotPositions = Array.from({ length: 5 }, (_, idx) => centerPosition + (idx - 2) * spacingStep);

    // Helper function to calculate display products
    const calculateDisplayProducts = (index: number) => {
        if (products.length === 0) return [];

        const totalProducts = products.length;
        const displayCount = Math.min(5, totalProducts);
        const newDisplay = [];

        for (let i = 0; i < displayCount; i++) {
            const offset = i - 2;
            let productIndex = (index + offset + totalProducts) % totalProducts;
            newDisplay.push(products[productIndex]);
        }

        return newDisplay.reverse();
    };

    // Auto-rotate carousel every 1 second
    useEffect(() => {
        if (products.length < 2) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % products.length;
            console.log('🔄 AUTO-ROTATE:', {
                from: currentIndex,
                to: nextIndex,
                productName: products[nextIndex]?.name,
                timestamp: new Date().toISOString()
            });
            setCurrentIndex(nextIndex);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentIndex, products.length, setCurrentIndex]);

    // Watch for currentIndex changes and trigger animation + update display simultaneously
    useEffect(() => {
        if (products.length < 2) return;

        const prevIndex = prevIndexRef.current;
        const totalProducts = products.length;

        if (prevIndex === currentIndex) {
            return;
        }

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

        // Update everything simultaneously - no delay
        const newDisplay = calculateDisplayProducts(currentIndex);

        console.log('📊 INDEX CHANGE:', {
            prevIndex,
            currentIndex,
            direction: animDirection,
            currentProduct: products[currentIndex]?.name,
            centerDisplayProduct: newDisplay[2]?.name,
            allDisplayProducts: newDisplay.map(p => p.name),
            timestamp: new Date().toISOString()
        });

        setDisplayProducts(newDisplay);
        setDirection(animDirection);

        // After animation completes, reset to idle
        const timer = setTimeout(() => {
            setDirection('idle');
            console.log('✅ ANIMATION COMPLETE:', {
                currentIndex,
                currentProduct: products[currentIndex]?.name,
                centerDisplayProduct: newDisplay[2]?.name // Use newDisplay instead of stale displayProducts
            });
        }, 500);

        prevIndexRef.current = currentIndex;

        return () => clearTimeout(timer);
    }, [currentIndex, products.length]);



    // Get position for a slot index based on current animation state
    // Using percentage-based positioning for responsive layout
    // Card width is 30%, so positions derive from centerPosition & spacingStep (dynamic spacing)
    const getPosition = (index: number, animState: 'idle' | 'next' | 'prev') => {
        // All states should have index 2 at center - only difference is the animation happens during state change
        // Default idle positions (percentage-based with tighter spacing)
        if (index === 0) return { x: `${slotPositions[1]}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0, blur: 0 };
        if (index === 1) return { x: `${slotPositions[1]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85, blur: 6 };
        if (index === 2) return { x: `${slotPositions[2]}%`, y: 0, scale: 1, zIndex: 50, opacity: 1, blur: 0 };
        if (index === 3) return { x: `${slotPositions[3]}%`, y: 4, scale: .55, zIndex: 20, opacity: 0.85, blur: 6 };
        if (index === 4) return { x: `${slotPositions[3]}%`, y: 12, scale: 0.4, zIndex: 5, opacity: 0, blur: 0 };

        return { x: '0%', y: 0, scale: 1, zIndex: 10, opacity: 0, blur: 0 };
    };

    if (displayProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }


    return (
        <div className="w-full flex flex-col overflow-hidden">
            {/* Product carousel container */}
            <div className="relative w-full pb-12 h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden flex items-center">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {displayProducts.map((product, i) => {
                    const currentPos = getPosition(i, direction);
                    return (
                        <div
                            key={product.id}
                            style={{
                                left: currentPos.x,
                                transform: `translateY(${currentPos.y}px) translateY(-8%) scale(${currentPos.scale})`,
                                opacity: currentPos.opacity,
                                filter: `blur(${currentPos.blur}px)`,
                                zIndex: currentPos.zIndex,
                            }}
                            className={`absolute w-[42%] aspect-[3/5] cursor-pointer transition-all duration-500 ease-out`}
                            onClick={() => {
                                const originalIndex = products.findIndex(p => p.id === product.id);
                                if (originalIndex >= 0) setCurrentIndex(originalIndex);
                            }}
                        >
                            {/* Product card with shadow */}
                            <div className="flex relative w-full h-full">
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
                                    className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-opacity duration-500 ${i === 2 ? 'w-[65%] h-3 bg-black/70 blur-md' : 'w-[60%] h-4 bg-black/60 blur-lg'}`}
                                    style={{
                                        bottom: '18%',
                                        opacity: i === 2 ? currentPos.opacity * 0.9 : currentPos.opacity * 0.8
                                    }}
                                />
                            </div>

                        </div>
                    );
                })}
                <div className='-ml-4 absolute flex flex-col items-center justify-center bottom-0 left-1/2 z-50 -translate-x-1/2 w-full'>
                    {/* Product name carousel - Infinite Vertical Scroller */}
                    <InfiniteVerticalScroller
                        names={products.map(p => p.name)}
                        currentIndex={currentIndex}
                        speed={3000}
                        className="mb-2"
                    />

                    {/* Subtitle */}
                    <h3 className="text-sm font-semibold text-black font-sans mb-8">
                        Full face covering hoodi | 7738
                    </h3>

                    <button className="px-6 py-2 rounded-2xl bg-gray-600 shadow-md text-white font-semibold hover:bg-gray-800 transition-colors">BUY NOW</button>
                </div>
            </div>
        </div>
    );
}