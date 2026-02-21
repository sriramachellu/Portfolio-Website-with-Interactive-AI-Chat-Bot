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
            className="glass-2"
            style={{
                position: 'fixed',
                top: 20,
                right: 24,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 100,
            }}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
            {TINTS.map((t) => (
                <button
                    key={t.id}
                    aria-label={`Set tint: ${t.label}`}
                    className={`tint-pill ${activeTint === t.id ? 'active' : ''}`}
                    style={{ background: t.color }}
                    onClick={() => setTint(t.id)}
                />
            ))}
        </motion.div>
    );
}
