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
    // duration in milliseconds for each item transition
    speed = 3000,
    className = "",
}: InfiniteVerticalScrollerProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const copyHeightRef = useRef(0);
    const runningRef = useRef(true);
    const itemHeightRef = useRef(0);


    // Measure one list item and compute copy height
    const measure = () => {
        const inner = innerRef.current;
        const vp = viewportRef.current;
        if (!inner || !vp) return;

        // find the first div (content) inside the first li
        const firstLi = inner.querySelector('.copy-0 li');
        const firstDiv = firstLi?.querySelector('div');
        if (!firstDiv) return;

        // Measure only the content div height (excludes li padding)
        const contentH = Math.ceil(firstDiv.getBoundingClientRect().height);
        itemHeightRef.current = contentH;

        // set viewport height to content height so only one item's content fits
        vp.style.height = `${contentH}px`;

        // one copy height = contentH * number of names
        copyHeightRef.current = contentH * names.length;
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
        // Ease-in-out function (cubic)
        const easeInOutCubic = (t: number): number => {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const step = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;

            if (runningRef.current) {
                const elapsed = time - startTimeRef.current;
                const duration = speed; // speed is now duration in ms
                const itemH = itemHeightRef.current || 0;
                const H = copyHeightRef.current || 0;

                if (itemH > 0) {
                    // Calculate progress (0 to 1) within current transition
                    let progress = (elapsed % duration) / duration;
                    
                    // Apply easing
                    const easedProgress = easeInOutCubic(progress);
                    
                    // Calculate which item we're transitioning from
                    const itemIndex = Math.floor(elapsed / duration) % names.length;
                    
                    // Calculate offset: start of current item + eased progress to next item
                    const offset = (itemIndex * itemH) + (easedProgress * itemH);
                    
                    // Wrap around when we exceed one copy height
                    const wrappedOffset = H > 0 ? offset % H : offset;
                    
                    if (innerRef.current) {
                        innerRef.current.style.transform = `translateY(${-wrappedOffset}px)`;
                    }
                }
            }

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [speed, names.length]);

    // pause on hover
    useEffect(() => {
        const vp = viewportRef.current;
        if (!vp) return;

        const onEnter = () => (runningRef.current = false);
        const onLeave = () => {
            startTimeRef.current = null;
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
                        padding: 0,
                        margin: 0
                    }}
                >
                    <div  className="px-4 text-center text-lg w-full uppercase font-[family-name:var(--font-mavine)] font-black tracking-[0.05em] text-4xl md:text-8xl text-black">
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
