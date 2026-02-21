'use client';

import { useEffect, useRef } from 'react';

export function useParallax(maxDeg = 3) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const rotateX = -dy * maxDeg;
            const rotateY = dx * maxDeg;
            ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            if (!ref.current) return;
            ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        };

        const el = ref.current;
        el?.addEventListener('mousemove', handleMouseMove, { passive: true });
        el?.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el?.removeEventListener('mousemove', handleMouseMove);
            el?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [maxDeg]);

    return ref;
}
