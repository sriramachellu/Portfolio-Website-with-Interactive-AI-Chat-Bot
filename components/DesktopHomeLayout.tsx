'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';
import { PortfolioAssistant } from '@/components/PortfolioAssistant';
import { ProjectShowcaseCard } from '@/components/ProjectShowcaseCard';
import { CORE_SKILLS } from '@/lib/skillsData';
import { SkillGroupCard } from '@/components/SkillGroupCard';
import { Timeline } from '@/components/Timeline';
import { CookingShowcaseCard } from '@/components/CookingShowcaseCard';
import { PhotographyShowcaseCard } from '@/components/PhotographyShowcaseCard';
import { NeuralBreakerGame } from '@/components/NeuralBreakerGame';

const { projects } = portfolioData;

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

interface DesktopHomeLayoutProps {
    heroSection: React.ReactNode;
    isMounted: boolean;
    randomPhotos: any[];
    randomRecipes: any[];
    selectedPhoto: any | null;
    setSelectedPhoto: (photo: any | null) => void;
}

export function DesktopHomeLayout({
    heroSection,
    isMounted,
    randomPhotos,
    randomRecipes,
    selectedPhoto,
    setSelectedPhoto,
}: DesktopHomeLayoutProps) {
    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden', paddingBottom: 160 }}>

            {/* SECTION 1 — Hero */}
            {heroSection}

            {/* SECTION 2 — Philosophy Strip */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginBottom: 'clamp(80px, 10vw, 120px)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                    className="glass-1"
                    style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: 'clamp(36px, 5vw, 56px) clamp(32px, 6vw, 80px)',
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(18px, 1.6vw, 25px)',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.70)',
                            lineHeight: 1.45,
                            letterSpacing: '-0.02em',
                            maxWidth: 1040,
                            margin: '0 auto',
                        }}
                    >
                        As an <span className="text-glass-tint">AI/ML engineer</span>, I build{' '}
                        <span className="text-glass-tint">production grade intelligent systems</span>{' '}
                        from <span className="text-glass-tint">machine learning pipelines</span> to distributed {' '}
                        <span className="text-glass-tint">RAG</span>,{' '}
                        <span className="text-glass-tint">LLMs</span>, and{' '}
                        <span className="text-glass-tint">multi agent architectures</span>.{' '}
                        I design and integrate <span className="text-glass-tint">LLM APIs</span> and{' '}
                        <span className="text-glass-tint">AI powered workflows</span> to move fast,
                        while engineering with discipline so systems scale beyond prototypes.
                        In production, <span className="text-glass-tint">latency, cost, and clarity</span> matter.{' '}
                    </p>
                </motion.div>
            </section>

            {/* SECTION 3 — Impressive Works */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginBottom: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' }}
                    >
                        <h2 className="text-section" style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 600, letterSpacing: '-0.03em' }}>
                            Impressive{' '}
                            <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                                Works
                            </span>
                        </h2>
                        <div style={{ textAlign: 'right', maxWidth: 320, marginLeft: 'auto' }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontWeight: 500, translate: '0 12px' }}>
                                PROJECTS THAT MOVE BEYOND EXPERIMENTATION SHOWCASING REAL WORLD AI SYSTEMS BUILT FOR PERFORMANCE, SCALE, AND IMPACT.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2-column showcase grid */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px 40px', marginBottom: 80 }}
                    >
                        {projects.slice(0, 4).map((p, i) => (
                            <ProjectShowcaseCard
                                key={p.id}
                                title={p.title}
                                tagline={(p as any).tagline}
                                description={p.description}
                                category={p.category}
                                architecture={(p as any).architecture}
                                impact={(p as any).impact}
                                stack={p.stack}
                                github={p.github}
                                demo={p.demo}
                                image={(p as any).image}
                                index={i}
                                displayType="visual"
                            />
                        ))}
                    </motion.div>

                    {/* Explore More Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Link href="/projects" style={{ textDecoration: 'none' }}>
                            <motion.span
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-2"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 100,
                                    fontSize: 13, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                                }}
                            >
                                Explore more <ArrowUpRight size={12} style={{ color: 'var(--tint-primary)', filter: 'drop-shadow(0 0 5px var(--tint-glow))' }} />
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 4 — Core Skills */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginBottom: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                    {/* Centered heading without gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ textAlign: 'center', marginBottom: 56 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(36px, 5vw, 56px)',
                            fontWeight: 500,
                            color: '#fff',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            maxWidth: 700,
                            margin: '0 auto 20px',
                        }}>
                            Core <span className="text-glass-tint">skills & libraries</span> that fuel my passion
                        </h2>
                    </motion.div>

                    {/* Native Masonry CSS Style Block */}
                    <style>{`
            .masonry-home {
              column-count: 1;
              column-gap: 24px;
              width: 100%;
            }
            @media (min-width: 768px) {
              .masonry-home { column-count: 2; }
            }
            @media (min-width: 1024px) {
              .masonry-home { column-count: 3; }
            }
            .masonry-home > div {
              break-inside: avoid;
              margin-bottom: 24px;
            }
          `}</style>

                    {/* Widget Layout (Masonry matching Skills Page) */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        className="masonry-home"
                    >
                        {CORE_SKILLS.map((group) => (
                            <SkillGroupCard
                                key={group.label}
                                category={group.label}
                                desc={group.desc}
                                items={group.items}
                            />
                        ))}
                    </motion.div>

                    {/* View All Skills Button (Moved below grid) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}
                    >
                        <Link href="/skills" style={{ textDecoration: 'none' }}>
                            <motion.span
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-2"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 100,
                                    fontSize: 13, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                                }}
                            >
                                View all skills <ArrowUpRight size={12} style={{ color: 'var(--tint-primary)', filter: 'drop-shadow(0 0 5px var(--tint-glow))' }} />
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 5 — Engineering Journey */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginTop: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.h2
                        className="text-section"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ color: '#fff', marginBottom: 64, textAlign: 'center' }}
                    >
                        Engineering{' '}
                        <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                            Journey
                        </span>
                    </motion.h2>

                    <Timeline items={portfolioData.workExperience} showBullets={false} showRedirection={true} />
                </div>
            </section>

            {/* SECTION 6 — Photography Preview */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginTop: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' }}
                    >
                        <h2 className="text-section" style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 600, letterSpacing: '-0.03em' }}>
                            Through {' '}
                            <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                                The Lens
                            </span>
                        </h2>
                        <div style={{ textAlign: 'right', maxWidth: 320, marginLeft: 'auto' }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontWeight: 500, translate: '0 12px' }}>
                                CAPTURING MOMENTS, ARCHITECTURE, AND LANDSCAPES FROM AROUND THE WORLD.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        className="masonry-home"
                    >
                        {isMounted && randomPhotos.map((photo, i) => (
                            <PhotographyShowcaseCard
                                key={photo.id}
                                photo={photo}
                                index={i}
                                onClick={() => setSelectedPhoto(photo)}
                            />
                        ))}
                    </motion.div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                        <Link href="/photography" style={{ textDecoration: 'none' }}>
                            <motion.span
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-2"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 100,
                                    fontSize: 13, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                                }}
                            >
                                View gallery <ArrowUpRight size={12} style={{ color: 'var(--tint-primary)', filter: 'drop-shadow(0 0 5px var(--tint-glow))' }} />
                            </motion.span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — Cooking Preview */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginTop: 'clamp(80px, 10vw, 120px)', marginBottom: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' }}
                    >
                        <h2 className="text-section" style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 600, letterSpacing: '-0.03em' }}>
                            From {' '}
                            <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                                The Kitchen
                            </span>
                        </h2>
                        <div style={{ textAlign: 'right', maxWidth: 320, marginLeft: 'auto' }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontWeight: 500, translate: '0 12px' }}>
                                FOOD IS BOTH CRAFT AND SYSTEM. EXPLORING TECHNIQUE, PRECISION, AND TASTE.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        className="masonry-home"
                    >
                        {isMounted && randomRecipes.map((recipe, i) => (
                            <CookingShowcaseCard key={recipe.id} recipe={recipe} index={i} />
                        ))}
                    </motion.div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                        <Link href="/cooking" style={{ textDecoration: 'none' }}>
                            <motion.span
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-2"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 100,
                                    fontSize: 13, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                                }}
                            >
                                View all recipes <ArrowUpRight size={12} style={{ color: 'var(--tint-primary)', filter: 'drop-shadow(0 0 5px var(--tint-glow))' }} />
                            </motion.span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 8 — Interactive AI Game */}
            <section style={{ padding: '0 clamp(24px, 6vw, 80px)', marginBottom: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', background: 'rgba(255,255,255,0.01)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <NeuralBreakerGame />
                </div>
            </section>

            {/* AI Assistant — fixed position, no layout impact */}
            <PortfolioAssistant />

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
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
                                src={selectedPhoto.image}
                                alt={selectedPhoto.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    borderRadius: 16,
                                    objectFit: 'contain',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                }}
                            />
                            <div style={{ marginTop: 24, padding: '0 12px 12px' }}>
                                <h2 className="text-section" style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>{selectedPhoto.title}</h2>
                                <p className="text-body" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {selectedPhoto.location} · {selectedPhoto.category} {selectedPhoto.year && `· ${selectedPhoto.year}`}
                                </p>
                                <button
                                    onClick={() => setSelectedPhoto(null)}
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
