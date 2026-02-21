'use client';

import { motion } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';

const { skills } = portfolioData;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.10 } },
};

const card = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function SkillsPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '100px 40px 160px',
                maxWidth: 1100,
                margin: '0 auto',
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                style={{ marginBottom: 64 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Expertise
                </p>
                <h1 className="text-section" style={{ color: '#fff' }}>Skills</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 480 }}>
                    A curated stack built for production AI/ML systems — from research to deployment.
                </p>
            </motion.div>

            {/* Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 20,
                }}
            >
                {skills.map((cat) => (
                    <motion.div
                        key={cat.category}
                        variants={card}
                        className="glass-2 card-hover"
                        style={{ padding: '28px 24px' }}
                    >
                        {/* Category label */}
                        <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
                            {cat.category}
                        </p>

                        {/* Skills pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {cat.items.map((skill) => (
                                <span
                                    key={skill}
                                    className="glass-3 text-micro"
                                    style={{
                                        padding: '5px 13px',
                                        color: 'rgba(255,255,255,0.78)',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
