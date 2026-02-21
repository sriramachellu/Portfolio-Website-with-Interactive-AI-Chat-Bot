'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';

const { projects } = portfolioData;
const ALL_CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

const card = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

export default function ProjectsPage() {
    const [active, setActive] = useState('All');
    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

    return (
        <div style={{ minHeight: '100vh', padding: '100px 40px 160px', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                style={{ marginBottom: 48 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Selected Work
                </p>
                <h1 className="text-section" style={{ color: '#fff' }}>Projects</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 480 }}>
                    Real systems. Real scale. Each project solves a problem worth solving.
                </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}
            >
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={active === cat ? '' : 'glass-3'}
                        style={{
                            padding: '7px 18px',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: active === cat ? 'none' : 'none',
                            background: active === cat ? 'var(--tint-primary)' : undefined,
                            color: active === cat ? '#fff' : 'rgba(255,255,255,0.65)',
                            transition: 'all 300ms ease',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Cards */}
            <motion.div
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 20,
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={card}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            layout
                            className="glass-2 card-hover"
                            style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}
                        >
                            {/* Category & Title */}
                            <div>
                                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                                    {project.category}
                                </p>
                                <h3 className="text-card-title" style={{ color: '#fff' }}>{project.title}</h3>
                            </div>

                            {/* Description */}
                            <p className="text-body" style={{ color: 'rgba(255,255,255,0.60)', flex: 1 }}>
                                {project.description}
                            </p>

                            {/* Stack pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {project.stack.map((s) => (
                                    <span key={s} className="glass-3 text-micro" style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.65)' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: 13, textDecoration: 'none' }}>
                                        <Github size={15} /> Code
                                    </a>
                                )}
                                {project.demo && (
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--tint-primary)', fontSize: 13, textDecoration: 'none' }}>
                                        <ExternalLink size={15} /> Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
