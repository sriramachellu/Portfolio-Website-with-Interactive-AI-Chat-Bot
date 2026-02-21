'use client';

import { useEffect, useRef } from 'react';

export default function AmbientGlow() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const x = ((e.clientX - cx) / cx) * 3;
            const y = ((e.clientY - cy) / cy) * 3;
            ref.current.style.setProperty('--refract-x', `${x}%`);
            ref.current.style.setProperty('--refract-y', `${y}%`);
        };
        window.addEventListener('mousemove', handleMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return <div ref={ref} className="ambient-glow" aria-hidden="true" />;
}
