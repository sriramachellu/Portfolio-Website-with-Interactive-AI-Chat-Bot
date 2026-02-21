'use client';

import { useEffect, useRef, useCallback } from 'react';

interface RefractionOffset {
    x: number;
    y: number;
}

export function useRefraction(intensity = 0.03): RefractionOffset {
    const offsetRef = useRef<RefractionOffset>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            offsetRef.current = {
                x: dx * intensity * 100,
                y: dy * intensity * 100,
            };
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [intensity]);

    return offsetRef.current;
}

export function useRefractionState(intensity = 0.03) {
    const ref = useRef<HTMLDivElement>(null);

    const update = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        const x = dx * intensity * 100;
        const y = dy * intensity * 100;
        ref.current.style.setProperty('--refract-x', `${x}%`);
        ref.current.style.setProperty('--refract-y', `${y}%`);
    }, [intensity]);

    useEffect(() => {
        window.addEventListener('mousemove', update, { passive: true });
        return () => window.removeEventListener('mousemove', update);
    }, [update]);

    return ref;
}
