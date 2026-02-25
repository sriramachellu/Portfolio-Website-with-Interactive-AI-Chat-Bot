'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTint } from '@/lib/TintContext';
import portfolioData from '@/lib/portfolio.json';
import { CookingShowcaseCard } from '@/components/CookingShowcaseCard';

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
                    From the Kitchen
                </p>

                <h1
                    style={{
                        fontSize: 'clamp(36px, 5vw, 54px)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        marginBottom: 24,
                    }}
                >
                    The <span className="text-glass-tint">Ingredients</span>, <span className="text-glass-tint">Timing</span>, and <span className="text-glass-tint">Flavor</span><br /> I use to craft balanced, intentional dishes.
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
                    Food is both craft and system where technique meets creativity, and precision meets taste.
                </motion.p>
            </div>

            {/* Masonry Grid */}
            <div className="cooking-grid">
                <style jsx>{`
                    .cooking-grid {
                        column-count: 1;
                        column-gap: 24px;
                        width: 100%;
                    }
                    @media (min-width: 768px) {
                        .cooking-grid { column-count: 2; }
                    }
                    @media (min-width: 1024px) {
                        .cooking-grid { column-count: 3; }
                    }
                `}</style>
                {cooking.map((recipe, i) => (
                    <CookingShowcaseCard key={recipe.id} recipe={recipe} index={i} />
                ))}
            </div>
        </div>
    );
}
