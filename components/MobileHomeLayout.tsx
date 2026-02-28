'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';
import { PortfolioAssistant } from '@/components/PortfolioAssistant';
import { TopInfoBar } from '@/components/TimeZoneWidget';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import { ProjectShowcaseCard } from '@/components/ProjectShowcaseCard';
import { CORE_SKILLS } from '@/lib/skillsData';
import { SkillGroupCard } from '@/components/SkillGroupCard';
import { Timeline } from '@/components/Timeline';
import { CookingShowcaseCard } from '@/components/CookingShowcaseCard';
import { PhotographyShowcaseCard } from '@/components/PhotographyShowcaseCard';
import { NeuralBreakerGame } from '@/components/NeuralBreakerGame';

const { personal, projects } = portfolioData;

const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const HELLO_WORDS = ['Hello', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'नमस्ते', 'హలో', 'こんにちは'];

/* ─── Mobile Hero — Photo stacked above text ──────────────────── */
function MobileHeroSection() {
    const [helloIndex, setHelloIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setHelloIndex((prev) => (prev + 1) % HELLO_WORDS.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            style={{
                position: 'relative',
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '140px 20px 100px',
                gap: 24,
            }}
        >
            {/* Timezone & Spotify — natively compact at top-left */}
            <TopInfoBar />
            <SpotifyNowPlaying />

            {/* Tagline moved below Spotify */}
            <div style={{ width: '100%', paddingLeft: 8 }}>
                <span
                    style={{
                        display: 'block',
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.5,
                        textAlign: 'center',
                    }}
                >
                </span>
            </div>

            {/* Photo — centered and above text */}
            <motion.div
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const }}
                style={{
                    width: 'min(50vw, 200px)',
                    height: 'min(38dvh, 250px)',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(24px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(140%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: '8px 8px 12px 8px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        flex: 1,
                        borderRadius: 10,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src="/Sri.png"
                        alt="Srirama Murthy Chellu"
                        fill
                        priority
                        sizes="260px"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            filter: 'grayscale(10%) brightness(0.90) contrast(1.02)',
                        }}
                    />
                </div>
            </motion.div>

            {/* Text content — below photo, LEFT aligned */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: 480,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: 0,
                    paddingLeft: 4,
                }}
            >
                {/* Badge */}
                <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
                    <span
                        className="glass-3 text-micro"
                        style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            color: 'var(--tint-primary)',
                            letterSpacing: '0.10em',
                            textTransform: 'capitalize',
                            transition: 'color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            fontSize: 11,
                        }}
                    >
                        AI/ML Engineer - Data Science at core
                    </span>
                </motion.div>

                {/* Hello + Name */}
                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                    <div style={{ height: 42, position: 'relative', marginBottom: 8 }}>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={HELLO_WORDS[helloIndex]}
                                initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -15, filter: 'blur(12px)' }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="text-glass-tint"
                                style={{
                                    display: 'block',
                                    fontSize: 36,
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {HELLO_WORDS[helloIndex]},
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <h1
                        style={{
                            fontSize: 28,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.95)',
                            lineHeight: 1.15,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        I'm Srirama Murthy Chellu
                    </h1>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    variants={fadeUp}
                    style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.55)',
                        fontWeight: 300,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.6,
                        maxWidth: 380,
                        marginBottom: 28,
                    }}
                >
                    Currently {calculateAge('2001-12-16')}, I’m an <span className="text-glass-tint">AI/ML engineer</span> turning complex data into <span className="text-glass-tint">production grade AI systems</span>. Originally from <span className="text-glass-tint">Hyderabad, India</span>, and now building in <span className="text-glass-tint">Los Angeles, California</span>, I work at the intersection of data, infrastructure, and scale. From a <span className="text-glass-tint">Master’s in Data Science</span> at Florida State University to <span className="text-glass-tint">distributed AI architectures</span>, I bridge theory with real world execution.
                </motion.p>

                {/* Social links */}
                <motion.div
                    variants={fadeUp}
                    style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'flex-start' }}
                >
                    {[
                        { href: personal.github, icon: <Github size={18} />, label: 'GitHub' },
                        { href: personal.linkedin, icon: <Linkedin size={18} />, label: 'LinkedIn' },
                        { href: `mailto:${personal.email}`, icon: <Mail size={18} />, label: 'Email' },
                    ].map(({ href, icon, label }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target={label !== 'Email' ? '_blank' : undefined}
                            rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                            whileHover={{ scale: 1.1 }}
                            className="glass-3"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                color: 'rgba(255,255,255,0.45)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.03)',
                            }}
                        >
                            {icon}
                        </motion.a>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ─── Shared section heading for mobile ───────────────────────── */
function MobileSectionHeading({ title, tintWord, subtitle }: { title: string; tintWord: string; subtitle: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ marginBottom: 32, textAlign: 'center' }}
        >
            <h2 className="text-section" style={{ color: '#fff', fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 12 }}>
                {title}{' '}
                <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                    {tintWord}
                </span>
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6, fontWeight: 500, maxWidth: 300, margin: '0 auto' }}>
                {subtitle}
            </p>
        </motion.div>
    );
}

/* ─── Explore button ──────────────────────────────────────────── */
function MobileExploreButton({ href, label }: { href: string; label: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <Link href={href} style={{ textDecoration: 'none' }}>
                <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="glass-2"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '9px 20px', borderRadius: 100,
                        fontSize: 13, fontWeight: 500,
                        color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                    }}
                >
                    {label} <ArrowUpRight size={12} style={{ color: 'var(--tint-primary)', filter: 'drop-shadow(0 0 5px var(--tint-glow))' }} />
                </motion.span>
            </Link>
        </div>
    );
}

/* ─── Mobile Home Layout ──────────────────────────────────────── */
interface MobileHomeLayoutProps {
    isMounted: boolean;
    randomPhotos: any[];
    randomRecipes: any[];
    selectedPhoto: any | null;
    setSelectedPhoto: (photo: any | null) => void;
}

export function MobileHomeLayout({
    isMounted,
    randomPhotos,
    randomRecipes,
    selectedPhoto,
    setSelectedPhoto,
}: MobileHomeLayoutProps) {
    const mobilePadding = '0 16px';

    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden', paddingBottom: 120 }}>

            {/* SECTION 1 — Mobile Hero */}
            <MobileHeroSection />

            {/* SECTION 2 — Philosophy Strip */}
            <section style={{ padding: mobilePadding, marginBottom: 56 }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                    className="glass-1"
                    style={{
                        margin: '0 auto',
                        padding: '28px 20px',
                        textAlign: 'center',
                        borderRadius: 20,
                    }}
                >
                    <p
                        style={{
                            fontSize: 14,
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.70)',
                            lineHeight: 1.55,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        As an <span className="text-glass-tint">AI/ML engineer</span>, I build{' '}
                        <span className="text-glass-tint">production grade intelligent systems</span>{' '}
                        from <span className="text-glass-tint">machine learning pipelines</span> to{' '}
                        <span className="text-glass-tint">RAG</span>,{' '}
                        <span className="text-glass-tint">LLMs</span>, and{' '}
                        <span className="text-glass-tint">multi agent architectures</span>.{' '}
                        In production, <span className="text-glass-tint">latency, cost, and clarity</span> matter.
                    </p>
                </motion.div>
            </section>

            {/* SECTION 3 — Impressive Works (single column) */}
            <section style={{ padding: mobilePadding, marginBottom: 56 }}>
                <MobileSectionHeading
                    title="Impressive"
                    tintWord="Works"
                    subtitle="REAL WORLD AI SYSTEMS BUILT FOR PERFORMANCE, SCALE, AND IMPACT."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}
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

                <MobileExploreButton href="/projects" label="Explore more" />
            </section>

            {/* SECTION 4 — Core Skills (single column) */}
            <section style={{ padding: mobilePadding, marginBottom: 56 }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                    style={{ textAlign: 'center', marginBottom: 32 }}
                >
                    <h2 style={{
                        fontSize: 28,
                        fontWeight: 500,
                        color: '#fff',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        margin: '0 auto 16px',
                    }}>
                        Core <span className="text-glass-tint">skills & libraries</span> that fuel my passion
                    </h2>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
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

                <MobileExploreButton href="/skills" label="View all skills" />
            </section>

            {/* SECTION 5 — Engineering Journey (single column) */}
            <section style={{ padding: mobilePadding, marginTop: 56 }}>
                <motion.h2
                    className="text-section"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    style={{ color: '#fff', marginBottom: 32, textAlign: 'center', fontSize: 32 }}
                >
                    Engineering{' '}
                    <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        Journey
                    </span>
                </motion.h2>

                <Timeline items={portfolioData.workExperience} showBullets={false} showRedirection={true} />
            </section>

            {/* SECTION 6 — Photography Preview (single column) */}
            <section style={{ padding: mobilePadding, marginTop: 56 }}>
                <MobileSectionHeading
                    title="Through"
                    tintWord="The Lens"
                    subtitle="CAPTURING MOMENTS AND LANDSCAPES FROM AROUND THE WORLD."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
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

                <MobileExploreButton href="/photography" label="View gallery" />
            </section>

            {/* SECTION 7 — Cooking Preview (single column) */}
            <section style={{ padding: mobilePadding, marginTop: 56, marginBottom: 56 }}>
                <MobileSectionHeading
                    title="From"
                    tintWord="The Kitchen"
                    subtitle="FOOD IS BOTH CRAFT AND SYSTEM. EXPLORING TECHNIQUE AND TASTE."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                    {isMounted && randomRecipes.map((recipe, i) => (
                        <CookingShowcaseCard key={recipe.id} recipe={recipe} index={i} />
                    ))}
                </motion.div>

                <MobileExploreButton href="/cooking" label="View all recipes" />
            </section>

            {/* SECTION 8 — Interactive AI Game */}
            <section style={{ marginBottom: 80 }}>
                <NeuralBreakerGame />
            </section>

            {/* AI Assistant */}
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
                            padding: 16,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-1"
                            style={{
                                maxWidth: '95vw',
                                maxHeight: '90vh',
                                width: 'fit-content',
                                padding: 8,
                                textAlign: 'center',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: 20,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedPhoto.image}
                                alt={selectedPhoto.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '60vh',
                                    borderRadius: 12,
                                    objectFit: 'contain',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                }}
                            />
                            <div style={{ marginTop: 16, padding: '0 8px 8px' }}>
                                <h2 className="text-section" style={{ color: '#fff', fontSize: 20, marginBottom: 6 }}>{selectedPhoto.title}</h2>
                                <p className="text-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                                    {selectedPhoto.location} · {selectedPhoto.category} {selectedPhoto.year && `· ${selectedPhoto.year}`}
                                </p>
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="glass-3"
                                    style={{ marginTop: 14, padding: '8px 28px', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, borderRadius: 100 }}
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
