'use client';

import { useTint, Tint } from '@/lib/TintContext';
import { motion } from 'framer-motion';

const TINTS: { id: Tint; color: string; label: string }[] = [
    { id: 'deep-blue', color: '#2563EB', label: 'Deep Blue' },
    { id: 'sage', color: '#5A8F6A', label: 'Sage' },
    { id: 'lavender', color: '#8B6CBB', label: 'Lavender' },
    { id: 'amber', color: '#D97706', label: 'Amber' },
    { id: 'teal', color: '#0D9488', label: 'Teal' },
    { id: 'rose', color: '#BE185D', label: 'Rose' },
    { id: 'clear', color: 'rgba(255,255,255,0.55)', label: 'Clear' },
];

export default function TintSwitcher() {
    const { activeTint, setTint } = useTint();

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: 20,
                right: 24,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 100,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
            {TINTS.map((t) => {
                const isActive = activeTint === t.id;
                return (
                    <button
                        key={t.id}
                        aria-label={`Set tint: ${t.label}`}
                        className="tint-pill"
                        style={{
                            background: t.color,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => setTint(t.id)}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-tint-ring"
                                style={{
                                    position: 'absolute',
                                    inset: -4,
                                    borderRadius: '50%',
                                    border: '1.5px solid rgba(255, 255, 255, 0.5)',
                                    boxShadow: '0 0 8px rgba(255,255,255,0.15)',
                                    pointerEvents: 'none'
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </motion.div>
    );
}
