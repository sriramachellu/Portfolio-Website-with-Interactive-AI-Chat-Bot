'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';

interface GlassPanelProps {
    level?: 1 | 2 | 3;
    tinted?: boolean;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    as?: string;
}

export default function GlassPanel({
    level = 2,
    tinted = false,
    className = '',
    children,
    style,
    onClick,
}: GlassPanelProps) {
    const levelClass = tinted ? 'glass-1-tinted' : `glass-${level}`;
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    return (
        <motion.div
            className={`${levelClass} ${className}`}
            style={style}
            onClick={onClick}
            whileHover={
                onClick && !mobile
                    ? { scale: 1.02, y: -4, transition: { duration: 0.25 } }
                    : undefined
            }
            whileTap={
                onClick && mobile
                    ? { scale: 1.02, y: -4, transition: { duration: 0.25 } }
                    : undefined
            }
        >
            {children}
        </motion.div>
    );
}
