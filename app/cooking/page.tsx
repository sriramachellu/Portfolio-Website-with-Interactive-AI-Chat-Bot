'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTint } from '@/lib/TintContext';
import portfolioData from '@/lib/portfolio.json';

const { cooking } = portfolioData;

const CARD_COLORS = [
    ['#2c1810', '#4a2515'],
    ['#0d1b2a', '#1b2838'],
    ['#1a1200', '#2e2000'],
    ['#1a0a00', '#2e1200'],
];

export default function CookingPage() {
    const { setTint } = useTint();

    // Override tint to Amber for warmth on this page
    useEffect(() => {
        setTint('amber');
        return () => setTint('deep-blue');
    }, [setTint]);

    return (
        <div style={{ minHeight: '100vh', padding: '100px 40px 160px', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 64 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    From the Kitchen
                </p>
                <h1 className="text-section" style={{ color: '#fff' }}>Cooking</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 520 }}>
                    Food as a system — ingredients, timing, and taste as parameters to optimize. Also just really good to eat.
                </p>
            </motion.div>

            {/* Recipe cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {cooking.map((recipe, i) => (
                    <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-2 card-hover"
                        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Color swatch top */}
                        <div style={{
                            height: 140,
                            background: `linear-gradient(135deg, ${CARD_COLORS[i % CARD_COLORS.length][0]}, ${CARD_COLORS[i % CARD_COLORS.length][1]})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                        }}>
                            {['🍚', '🍜', '🍞', '🐟'][i % 4]}
                        </div>

                        <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                            <h3 className="text-card-title" style={{ color: '#fff' }}>{recipe.title}</h3>
                            <p className="text-body" style={{ color: 'rgba(255,255,255,0.60)', flex: 1 }}>{recipe.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                {recipe.tags.map((tag) => (
                                    <span key={tag} className="glass-3 text-micro" style={{ padding: '4px 10px', color: 'var(--tint-primary)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
