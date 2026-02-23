'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';
import { ProjectShowcaseCard } from '@/components/ProjectShowcaseCard';

const { projects } = portfolioData;
const ALL_CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

export default function ProjectsPage() {
    const [active, setActive] = useState('All');
    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

    return (
        <div style={{ minHeight: '100vh', padding: '120px 24px 160px', maxWidth: 1280, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                style={{ marginBottom: 64, textAlign: 'center' }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                    Projects
                </p>
                <h1 className="text-section" style={{ color: '#fff', marginBottom: 20 }}><span className="text-glass-tint">Systems</span> That Learn</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 540, margin: '0 auto' }}>
                    I design and build AI driven systems from retrieval augmented assistants to full stack ML platforms focused on performance, reliability, and real world impact.                </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ display: 'flex', gap: 12, marginBottom: 64, flexWrap: 'wrap', justifyContent: 'center' }}
            >
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={active === cat ? '' : 'glass-3'}
                        style={{
                            padding: '8px 24px',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            background: active === cat ? 'var(--tint-primary)' : 'rgba(255,255,255,0.03)',
                            color: active === cat ? '#fff' : 'rgba(255,255,255,0.65)',
                            border: active === cat ? '1px solid var(--tint-primary)' : '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Cards Grid */}
            <motion.div
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                    gap: 32,
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((project, index) => (
                        <ProjectShowcaseCard
                            key={project.id}
                            index={index}
                            title={project.title}
                            description={project.description}
                            category={project.category}
                            stack={project.stack}
                            github={project.github}
                            demo={project.demo}
                            image={project.image}
                            variant="full"
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
