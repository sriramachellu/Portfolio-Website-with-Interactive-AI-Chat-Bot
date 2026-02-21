'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';

const { photography } = portfolioData;

// Placeholder color palettes for photos (since we have no real images)
const PHOTO_COLORS = [
    ['#1a1a2e', '#16213e', '#0f3460'],
    ['#1c1c1c', '#2d2d2d', '#404040'],
    ['#0d0d0d', '#1a0a00', '#330d00'],
    ['#000814', '#001d3d', '#003566'],
    ['#10002b', '#240046', '#3c096c'],
    ['#012a4a', '#013a63', '#01497c'],
];

const CATEGORIES = ['All', ...Array.from(new Set(photography.map((p) => p.category)))];

export default function PhotographyPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [lightbox, setLightbox] = useState<(typeof photography)[0] | null>(null);

    const filtered = activeCategory === 'All'
        ? photography
        : photography.filter((p) => p.category === activeCategory);

    return (
        <div style={{ minHeight: '100vh', padding: '100px 40px 160px', maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 48 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Through the Lens
                </p>
                <h1 className="text-section" style={{ color: '#fff' }}>Photography</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 480 }}>
                    Light, shadow, and the quiet moments between.
                </p>
            </motion.div>

            {/* Filter */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={activeCategory === cat ? '' : 'glass-3'}
                        style={{
                            padding: '7px 18px',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: 'none',
                            background: activeCategory === cat ? 'var(--tint-primary)' : undefined,
                            color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.65)',
                            transition: 'all 300ms ease',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Grid */}
            <motion.div
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((photo, i) => {
                        const colors = PHOTO_COLORS[parseInt(photo.id) - 1] || PHOTO_COLORS[0];
                        return (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                layout
                                className="card-hover"
                                onClick={() => setLightbox(photo)}
                                style={{
                                    height: i % 3 === 0 ? 280 : 220,
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                                }}
                            >
                                {/* Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: 18,
                                }}>
                                    <p className="text-card-title" style={{ color: '#fff', fontSize: 15 }}>{photo.title}</p>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                        <span className="glass-3 text-micro" style={{ padding: '3px 10px', color: 'rgba(255,255,255,0.75)' }}>
                                            {photo.category}
                                        </span>
                                        <span className="glass-3 text-micro" style={{ padding: '3px 10px', color: 'rgba(255,255,255,0.60)' }}>
                                            {photo.location}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.80)',
                            backdropFilter: 'blur(24px)',
                            padding: 32,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, y: 32 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 16 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-1-tinted"
                            style={{ maxWidth: 600, width: '100%', padding: 40, textAlign: 'center' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                height: 320,
                                borderRadius: 16,
                                background: `linear-gradient(135deg, ${PHOTO_COLORS[parseInt(lightbox.id) - 1]?.[0]}, ${PHOTO_COLORS[parseInt(lightbox.id) - 1]?.[2]})`,
                                marginBottom: 24,
                            }} />
                            <h2 className="text-card-title" style={{ color: '#fff', marginBottom: 8 }}>{lightbox.title}</h2>
                            <p className="text-body" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                {lightbox.category} · {lightbox.location}
                            </p>
                            <button
                                onClick={() => setLightbox(null)}
                                className="glass-3"
                                style={{ marginTop: 24, padding: '8px 24px', color: 'rgba(255,255,255,0.65)', border: 'none', cursor: 'pointer', fontSize: 14 }}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
