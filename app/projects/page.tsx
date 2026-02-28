'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';
import { ProjectShowcaseCard } from '@/components/ProjectShowcaseCard';
import { useIsMobile } from '@/lib/useIsMobile';

const { projects } = portfolioData;
const ALL_CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

export default function ProjectsPage() {
    const [active, setActive] = useState('All');
    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    return (
        <div style={{ minHeight: '100vh', padding: '120px 24px 160px', maxWidth: 1280, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 64 }}>
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontSize: 12 }}>
                    Projects
                </p>

                <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
                    The <span className="text-glass-tint">Systems</span> and <span className="text-glass-tint">Architectures</span><br />
                    I design to learn, adapt, and scale.
                </h1>

                <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 24 }}></div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}
                >
                    From retrieval-augmented assistants to full stack ML platforms each project is engineered for performance, reliability, and real world impact.
                </motion.p>
            </div>

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
                    gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
                    gap: mobile ? 24 : 32,
                    width: '100%',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((project, index) => (
                        <ProjectShowcaseCard
                            key={project.id}
                            index={index}
                            title={project.title}
                            tagline={(project as any).tagline}
                            description={project.description}
                            category={project.category}
                            architecture={(project as any).architecture}
                            impact={(project as any).impact}
                            stack={project.stack}
                            github={project.github}
                            demo={project.demo}
                            image={project.image}
                            displayType="architectural"
                            mobileHeight={580}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
