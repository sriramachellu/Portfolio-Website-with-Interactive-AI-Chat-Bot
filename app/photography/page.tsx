'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';
import { PhotographyShowcaseCard } from '@/components/PhotographyShowcaseCard';
import { useLightbox } from '@/lib/LightboxContext';

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
    const { setIsLightboxOpen } = useLightbox();
    const [activeCategory, setActiveCategory] = useState('All');
    const [lightbox, setLightbox] = useState<(typeof photography)[0] | null>(null);

    useEffect(() => {
        setIsLightboxOpen(lightbox !== null);
    }, [lightbox, setIsLightboxOpen]);

    const filtered = activeCategory === 'All'
        ? photography
        : photography.filter((p) => p.category === activeCategory);

    return (
        <div style={{ minHeight: '100vh', padding: '120px 40px 200px', maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <p
                    style={{
                        color: 'var(--tint-primary)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                        fontSize: 12,
                    }}
                >
                    Through the Lens
                </p>

                <h1
                    style={{
                        fontSize: 'clamp(36px, 5vw, 54px)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        marginBottom: 24,
                    }}
                >
                    The <span className="text-glass-tint">Light</span>, <span className="text-glass-tint">Composition</span>, and <span className="text-glass-tint">Moments</span><br /> I capture with intention and precision.
                </h1>
                <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 24 }}></div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(15px, 2vw, 17px)',
                        color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.6,
                    }}
                >
                    Every frame is an exercise in observation balancing contrast, depth, and timing to tell quiet, powerful stories.
                </motion.p>
            </div>

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

            {/* Masonry Grid */}
            <motion.div
                layout
                style={{
                    columnCount: filtered.length > 0 ? 3 : 1,
                    columnGap: 24,
                }}
                className="photography-grid"
            >
                <style jsx>{`
                    .photography-grid {
                        column-count: 1;
                        column-gap: 24px;
                        width: 100%;
                    }
                    @media (min-width: 768px) {
                        .photography-grid { column-count: 2; }
                    }
                    @media (min-width: 1024px) {
                        .photography-grid { column-count: 3; }
                    }
                `}</style>
                <AnimatePresence mode="popLayout">
                    {filtered.map((photo, i) => (
                        <PhotographyShowcaseCard
                            key={photo.id}
                            photo={photo}
                            index={i}
                            onClick={() => setLightbox(photo)}
                        />
                    ))}
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
                            background: 'rgba(0,0,0,0.92)',
                            backdropFilter: 'blur(12px)',
                            padding: 24,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-1"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                width: 'fit-content',
                                padding: 12,
                                textAlign: 'center',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={lightbox.image}
                                alt={lightbox.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    borderRadius: 16,
                                    objectFit: 'contain',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                }}
                            />
                            <div style={{ marginTop: 24, padding: '0 12px 12px' }}>
                                <h2 className="text-section" style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>{lightbox.title}</h2>
                                <p className="text-body" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {lightbox.location} · {lightbox.category} {lightbox.year && `· ${lightbox.year}`}
                                </p>
                                <button
                                    onClick={() => setLightbox(null)}
                                    className="glass-3"
                                    style={{ marginTop: 20, padding: '10px 32px', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, borderRadius: 100 }}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
