'use client';

import { useState } from 'react';

interface ProductOptionsProps {
    hasColors: boolean;
    colors: string[];
    hasSizes: boolean;
    sizes: string[];
}

export default function ProductOptions({
    hasColors = false,
    colors = [],
    hasSizes = false,
    sizes = []
}: ProductOptionsProps) {
    const [selectedColor, setSelectedColor] = useState(colors?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(sizes?.[0] || '');

    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-16 mt-4 mb-8">
            {/* Color Selection */}
            {hasColors && colors.length > 0 && (
                <div className="space-y-3">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Color: <span className="text-black ml-1">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                        {colors.map((color) => {
                            const isHex = color.startsWith('#');
                            return (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColor === color
                                        ? 'border-black'
                                        : 'border-transparent hover:border-gray-300'
                                        }`}
                                    title={color}
                                >
                                    <div
                                        className="w-full h-full rounded-full border border-black/5"
                                        style={{
                                            backgroundColor: isHex ? color : color.toLowerCase(),
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {hasSizes && sizes.length > 0 && (
                <div className="space-y-3">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Size: <span className="text-black ml-1 uppercase">{selectedSize}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[3.5rem] h-10 rounded-xl border-2 font-bold uppercase tracking-widest text-[10px] transition-all ${selectedSize === size
                                    ? 'bg-black border-black text-white'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
