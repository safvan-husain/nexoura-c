'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type ProductCrouselProps = {
    products: { img: string, name: string, price: number, id: number }[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void
}

export function ProductCrousel({ products, currentIndex, setCurrentIndex }: ProductCrouselProps) {
    const [toggled, setToggled] = useState(false);

    // Only show 5 products at a time
    const visibleProducts = products.slice(0, 5);
    
    // Base positions (px) for five slots (left-to-right)
    const slotX = [0, 140, 280, 420, 560];
    const boxWidth = 120;
    const boxHeight = 160;

    // Helper to compute visual props for each box index (0..4)
    function propsFor(index: number) {
        // Default positions when NOT toggled (initial state)
        if (!toggled) {
            // Box 1 is hidden under slot 2 (slotX[1]) with zero size (will expand when toggled)
            if (index === 0) return { x: slotX[1], y: 8, scale: 0.01, zIndex: 10, opacity: 0 };
            // Boxes 2,3,4 are visible in front
            if (index === 1) return { x: slotX[1], y: 0, scale: 1, zIndex: 40, opacity: 1 };
            if (index === 2) return { x: slotX[2], y: 0, scale: 1, zIndex: 35, opacity: 1 };
            if (index === 3) return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
            // Box 5 is hidden under box 4 (so placed at slotX[3], slightly behind)
            if (index === 4) return { x: slotX[3], y: 8, scale: 0.92, zIndex: 9, opacity: 1 };
        }

        // Toggled state - run the sequence:
        // 4th box (index 3) disappears
        // 3rd (index 2) -> slot of 4 (slot index 3)
        // 2nd (index 1) -> slot of 3 (slot index 2)
        // 1st (index 0) -> expands from zero to slot of 2 (slot index 1)
        // 5th (index 4) remains hidden under where 4 was (stays at slotX[3])
        if (index === 3) {
            // box 4: shrink & disappear
            return { x: slotX[3], y: 0, scale: 0.01, zIndex: 5, opacity: 0 };
        }
        if (index === 2) {
            // box 3 -> slot of 4
            return { x: slotX[3], y: 0, scale: 1, zIndex: 30, opacity: 1 };
        }
        if (index === 1) {
            // box 2 -> slot of 3
            return { x: slotX[2], y: 0, scale: 1, zIndex: 25, opacity: 1 };
        }
        if (index === 0) {
            // box 1: expand from zero to slot of 2 (replacing 2's original spot after it moves)
            return { x: slotX[1], y: 0, scale: 1, zIndex: 22, opacity: 1 };
        }
        // index === 4 (box 5) keep hidden under old 4 slot
        return { x: slotX[3], y: 8, scale: 0.92, zIndex: 9, opacity: 1 };
    }

    if (visibleProducts.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    return (
        <div className="w-full min-h-[320px] flex items-center justify-center p-8">
            <div className="relative w-[720px] h-[220px]">
                {/* Boxes: render all five so stacking/animation looks natural */}
                {visibleProducts.map((product, i) => {
                    const target = propsFor(i);
                    
                    // Set a sensible "from" state so animations look correct both directions
                    let initial;
                    if (!toggled) {
                        // Initial when component mounts (not toggled): use the not-toggled props
                        initial = { x: target.x, y: target.y, scale: target.scale, opacity: target.opacity };
                    } else {
                        // When toggled is true, we want boxes to animate from their NOT-toggled visual
                        // to the toggled visual — so set initial based on the inverse state
                        if (i === 0) initial = { x: slotX[1], y: 8, scale: 0.01, opacity: 0 };
                        else if (i === 4) initial = { x: slotX[3], y: 8, scale: 0.92, opacity: 1 };
                        else initial = { x: slotX[i], y: 0, scale: 1, opacity: 1 };
                    }

                    return (
                        <motion.div
                            key={product.id}
                            initial={initial}
                            animate={{ 
                                x: target.x, 
                                y: target.y, 
                                scale: target.scale, 
                                opacity: target.opacity 
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            style={{ width: boxWidth, height: boxHeight, zIndex: target.zIndex }}
                            className="absolute top-12 rounded-2xl shadow-xl bg-white overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
                            onClick={() => setCurrentIndex(i)}
                        >
                            <div className="relative w-full h-24">
                                {product.img.length > 0 ? <Image
                                    src={product.img}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                /> : <div className="bg-red-500"></div>}
                                
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

                {/* Button bottom-right */}
                <div className="absolute right-2 bottom-2">
                    <button
                        onClick={() => setToggled((s) => !s)}
                        className="px-4 py-2 rounded-full bg-gray-900 text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}