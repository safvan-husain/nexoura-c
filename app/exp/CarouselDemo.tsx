'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type CarouselCard = {
    id: number;
    title: string;
    description: string;
    gradient: string;
};

const BOXES: CarouselCard[] = [
    { id: 1, title: 'Azure', description: 'Digital commerce toolkit', gradient: 'from-sky-500 to-blue-600' },
    { id: 2, title: 'Flare', description: 'Realtime analytics pulse', gradient: 'from-orange-500 to-amber-500' },
    { id: 3, title: 'Nova', description: 'AI-assisted workflows', gradient: 'from-fuchsia-500 to-purple-600' },
    { id: 4, title: 'Evergreen', description: 'Sustainable sourcing', gradient: 'from-emerald-500 to-green-600' },
    { id: 5, title: 'Voltage', description: 'Edge acceleration layer', gradient: 'from-yellow-500 to-lime-500' },
    { id: 6, title: 'Graphite', description: 'Design system tokens', gradient: 'from-slate-600 to-gray-800' },
    { id: 7, title: 'Pulse', description: 'Monitoring pipelines', gradient: 'from-rose-500 to-red-500' },
    { id: 8, title: 'Orbit', description: 'Logistics orchestration', gradient: 'from-cyan-500 to-teal-500' },
    { id: 9, title: 'Quartz', description: 'Data quality controls', gradient: 'from-stone-400 to-zinc-500' },
    { id: 10, title: 'Aurora', description: 'Customer experience OS', gradient: 'from-indigo-500 to-violet-600' },
];

const VISIBLE_COUNT = 3;
const CARD_WIDTH = 240;
const CARD_GAP = 20;
const DUPLICATE_BLOCKS = 3;

export function CarouselDemo() {
    const baseLength = BOXES.length;
    const extendedCards = useMemo(() => {
        return Array.from({ length: DUPLICATE_BLOCKS }, (_, dupIdx) =>
            BOXES.map((card) => ({ ...card, uid: `${card.id}-${dupIdx}` }))
        ).flat();
    }, []);

    const startIndex = baseLength; // start on the middle block to allow seamless looping
    const [position, setPosition] = useState(startIndex);
    const [isJumping, setIsJumping] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const offset = -((position - baseLength) * (CARD_WIDTH + CARD_GAP));

    useEffect(() => {
        if (position >= baseLength * 2) {
            setIsJumping(true);
            setPosition((prev) => prev - baseLength);
            return;
        }

        if (position < baseLength) {
            setIsJumping(true);
            setPosition((prev) => prev + baseLength);
            return;
        }

        if (isJumping) {
            const id = requestAnimationFrame(() => setIsJumping(false));
            return () => cancelAnimationFrame(id);
        }
    }, [position, baseLength, isJumping]);

    useEffect(() => {
        if (!isAnimating) return;
        const timer = setTimeout(() => setIsAnimating(false), 320);
        return () => clearTimeout(timer);
    }, [isAnimating]);

    const handleStep = (direction: 1 | -1) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setPosition((prev) => prev + direction);
    };

    const normalizedIndex = ((position - baseLength) % baseLength + baseLength) % baseLength;
    const visibleLabels = useMemo(
        () =>
            Array.from({ length: VISIBLE_COUNT }, (_, idx) => {
                return ((normalizedIndex + idx) % baseLength) + 1;
            }),
        [normalizedIndex, baseLength]
    );

    const transition = isJumping
        ? { duration: 0 }
        : {
            type: 'spring',
            stiffness: 160,
            damping: 24,
            mass: 1,
        };

    const viewportWidth = VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * CARD_GAP;

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center">
            <div className="flex items-center gap-6">
                <button
                    aria-label="Previous cards"
                    onClick={() => handleStep(-1)}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-40"
                    disabled={isAnimating}
                >
                    Prev
                </button>
                <div className="text-sm font-medium text-white/70">
                    Cards {visibleLabels.join(', ')} of {baseLength}
                </div>
                <button
                    aria-label="Next cards"
                    onClick={() => handleStep(1)}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-40"
                    disabled={isAnimating}
                >
                    Next
                </button>
            </div>

            <div
                className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 px-10 py-12"
                style={{ width: `min(100%, ${viewportWidth + 160}px)` }}
            >
                <div className="absolute inset-0 pointer-events-none rounded-[32px] bg-gradient-to-b from-white/10 via-transparent to-white/10" />
                <motion.div
                    className="relative"
                    animate={{ x: offset }}
                    transition={transition as any}
                >
                    <div className="flex" style={{ gap: `${CARD_GAP}px` }}>
                        {extendedCards.map((card, idx) => (
                            <div
                                key={`${card.uid}-${idx}`}
                                className="flex-shrink-0"
                                style={{ width: `${CARD_WIDTH}px` }}
                            >
                                <div className={`h-72 rounded-3xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-2xl flex flex-col justify-between`}>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Exp #{card.id}</p>
                                        <h3 className="mt-3 text-2xl font-semibold">{card.title}</h3>
                                        <p className="mt-2 text-sm text-white/80">{card.description}</p>
                                    </div>
                                    <div className="text-xs text-white/70">Card {card.id} / {baseLength}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent" />
            </div>
        </div>
    );
}

