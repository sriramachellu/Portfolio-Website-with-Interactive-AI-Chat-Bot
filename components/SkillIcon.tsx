import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';

export interface SkillIconProps {
    name: string;
    iconSlug?: string;
}

export function SkillIcon({ name, iconSlug }: SkillIconProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    // Fallback to simpler slugification if not explicitly provided
    const slug = iconSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const fallbackLetter = name.charAt(0).toUpperCase();

    return (
        <motion.div
            className="relative flex items-center justify-center flex-shrink-0"
            style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                cursor: 'default',
                overflow: 'visible', // for tooltip
            }}
            onHoverStart={() => !mobile && setIsHovered(true)}
            onHoverEnd={() => !mobile && setIsHovered(false)}
            onTapStart={() => mobile && setIsHovered(true)}
            onTapCancel={() => mobile && setIsHovered(false)}
            onTap={() => mobile && setIsHovered(false)}
            whileHover={!mobile ? { scale: 1.05, translateY: -4 } : undefined}
            whileTap={mobile ? { scale: 1.05, translateY: -4 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Icon or Fallback */}
            {!imageError ? (
                <div style={{ position: 'relative', width: 24, height: 24 }}>
                    {/* We load directly from public/skills/ where we cached the SVGs. */}
                    <Image
                        src={`/skills/${slug}.svg`}
                        alt={name}
                        fill
                        sizes="24px"
                        style={{ objectFit: 'contain' }}
                        unoptimized // static svg 
                        onError={() => setImageError(true)}
                    />
                </div>
            ) : (
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: 600 }}>
                    {fallbackLetter}
                </span>
            )}

            {/* Hover glow ring */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                style={{
                    position: 'absolute',
                    inset: -1,
                    borderRadius: '50%',
                    border: '1px solid var(--tint-primary)',
                    boxShadow: '0 0 12px var(--tint-primary)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 2, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="glass-3 text-micro"
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            marginBottom: 8, // Tighter margin to fit inside card padding
                            padding: '6px 12px',
                            whiteSpace: 'nowrap',
                            color: '#fff',
                            zIndex: 50,
                            pointerEvents: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '100px'
                        }}
                    >
                        {name}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
