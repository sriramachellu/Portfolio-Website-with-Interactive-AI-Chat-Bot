'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Hydration-safe hook for detecting mobile viewport.
 * Returns `null` during SSR / first render to avoid hydration mismatch,
 * then `true` (< 768px) or `false` (≥ 768px) after mount.
 */
export function useIsMobile(): boolean | null {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

        const update = () => setIsMobile(mql.matches);
        update(); // set initial value on mount

        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, []);

    return isMobile;
}
