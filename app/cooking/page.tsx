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
