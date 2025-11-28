'use client'

import React, { useEffect, useRef } from "react";

type InfiniteVerticalScrollerProps = {
    names?: string[];
    speed?: number;
    className?: string;
}

// InfiniteVerticalScroller (single-item viewport)
// - Shows exactly one full item in the viewport at any time.
// - While moving, parts of two items can be visible (top and bottom) to create
//   a smooth transition between names.
// Key changes:
// - Measure the first <li> height (itemHeight) and set the viewport height to that value.
// - Remove extra paddings/margins between list items so there's no vertical gap.
// - copyHeight = itemHeight * names.length (height of one full copy).
export function InfiniteVerticalScroller({
    names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace"],
    // speed is pixels per second (one item height per second = itemHeight px/sec)
    speed = 40,
    className = "",
}: InfiniteVerticalScrollerProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);
    const offsetRef = useRef(0);
    const copyHeightRef = useRef(0);
    const runningRef = useRef(true);
    const itemHeightRef = useRef(0);

    // Measure one list item and compute copy height
    const measure = () => {
        const inner = innerRef.current;
        const vp = viewportRef.current;
        if (!inner || !vp) return;

        // find the first li inside the first copy
        const firstLi = inner.querySelector('.copy-0 li');
        if (!firstLi) return;

        const itemH = Math.ceil(firstLi.getBoundingClientRect().height);
        itemHeightRef.current = itemH;

        // set viewport height to item height so only one item fits fully
        vp.style.height = `${itemH - 30}px`;

        // one copy height = itemH * number of names
        copyHeightRef.current = itemH * names.length;
    };

    // measure on mount and resize
    useEffect(() => {
        const id = requestAnimationFrame(measure);
        const onResize = () => requestAnimationFrame(measure);
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener('resize', onResize);
        };
    }, [names]);

    useEffect(() => {
        const step = (time: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const dt = (time - lastTimeRef.current) / 1000;
            lastTimeRef.current = time;

            if (runningRef.current) {
                offsetRef.current += speed * dt; // pixels scrolled
                const H = copyHeightRef.current || 0;
                if (H > 0 && offsetRef.current >= H) {
                    offsetRef.current = offsetRef.current % H;
                }
                if (innerRef.current) {
                    innerRef.current.style.transform = `translateY(${-offsetRef.current}px)`;
                }
            }

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [speed]);

    // pause on hover
    useEffect(() => {
        const vp = viewportRef.current;
        if (!vp) return;

        const onEnter = () => (runningRef.current = false);
        const onLeave = () => {
            lastTimeRef.current = null;
            runningRef.current = true;
        };

        vp.addEventListener('mouseenter', onEnter);
        vp.addEventListener('mouseleave', onLeave);

        return () => {
            vp.removeEventListener('mouseenter', onEnter);
            vp.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    // A single copy: ul with no margins/padding so items stack exactly
    const ListCopy = ({ copyIndex }: { copyIndex: number }) => (
        <ul
            className={`copy-${copyIndex}`}
            style={{ margin: 0, padding: 0, listStyle: 'none' }}
        >
            {names.map((n, i) => (
                <li
                    key={`${copyIndex}-${i}-${n}`}
                    // important: no vertical spacing, make each li a block sized by its content
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 'auto',
                        padding: '6px 0'
                    }}
                >
                    <div className="px-4 text-center text-lg w-full uppercase font-[family-name:var(--font-mavine)] font-black tracking-[0.05em] text-4xl md:text-8xl text-black">
                        {n}
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className={`w-full ${className}`}>
            <div
                ref={viewportRef}
                className="overflow-hidden"
                style={{ position: 'relative' }}
            >
                <div
                    ref={innerRef}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        willChange: 'transform'
                    }}
                >
                    <ListCopy copyIndex={0} />
                    <ListCopy copyIndex={1} />
                </div>
            </div>
        </div>
    );
}
