'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink, Linkedin, Mail } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';
import { PortfolioAssistant } from '@/components/PortfolioAssistant';
import { TopInfoBar } from '@/components/TimeZoneWidget';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
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

/* ─── Animation Variants ─────────────────────────────────────── */
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

import { CORE_SKILLS } from '@/lib/skillsData';
import { SkillGroupCard } from '@/components/SkillGroupCard';
import { Timeline } from '@/components/Timeline';
import { CookingShowcaseCard } from '@/components/CookingShowcaseCard';
import { PhotographyShowcaseCard } from '@/components/PhotographyShowcaseCard';
import { useLightbox } from '@/lib/LightboxContext';

/* ─── Background Word Lines ──────────────────────────────────── */
const BG_LINES = ['AI SYSTEMS', 'LLMs', 'PRODUCTION', 'RAG', 'ML'];
const HELLO_WORDS = ['Hello', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'नमस्ते', 'హలో', 'こんにちは'];

/* ─── Hero Section ───────────────────────────────────────────── */
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return;
    const { width, height, left, top } = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - left) / width - 0.5) * 2; // -1 to 1
    const ny = ((e.clientY - top) / height - 0.5) * 2;

    if (photoRef.current) {
      photoRef.current.style.transform = `translate(${nx * 4}px, ${ny * 4}px)`;
    }
    if (bgWordsRef.current) {
      bgWordsRef.current.style.transform = `translate(${nx * 2}px, ${ny * 2}px)`;
    }
  }, []);

  const [helloIndex, setHelloIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHelloIndex((prev) => (prev + 1) % HELLO_WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    section.addEventListener('mousemove', onMouseMove as EventListener, { passive: true });
    return () => section.removeEventListener('mousemove', onMouseMove as EventListener);
  }, [onMouseMove]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* ── Timezone widget — top left ───────────────────────── */}
      <TopInfoBar />
      <SpotifyNowPlaying />

      {/* ── Layer 0: Big bg typography ──────────────────────── */}
      <div
        ref={bgWordsRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          transition: 'transform 0.1s linear',
        }}
      >
        {BG_LINES.map((line, i) => (
          <motion.span
            key={line}
            initial={{
              opacity: 0,
              x: '30vw'   // start off to the right
            }}
            animate={{
              opacity: 0.03,
              x: 0
            }}
            transition={{
              duration: 2.6,
              delay: 0.6 + i * 0.18,
              ease: [0.22, 1, 0.36, 1]  // smooth cinematic easing
            }}
            style={{
              display: 'block',
              fontSize: 'clamp(72px, 13vw, 196px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              color: 'rgba(255,255,255,0.9)',
              filter: 'blur(5px)',
              whiteSpace: 'nowrap',
              willChange: 'transform, opacity'
            }}
          >
            {line}
          </motion.span>
        ))}
      </div>

      {/* ── Layer 1: Glass Polaroid ───────────────────────────── */}
      {/* Centering wrapper — pure CSS, no Framer Motion */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(40px, 8vw, 120px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <div ref={photoRef} style={{ transition: 'transform 0.1s linear' }}>
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            whileHover={{ scale: 1.04, rotate: -6, borderColor: 'var(--tint-primary)' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
              width: 'clamp(240px, 28vw, 380px)',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '14px 14px 56px 14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
              cursor: 'default',
            }}
          >
            {/* Photo inside polaroid */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Image
                src="/Sri.png"
                alt="Srirama Murthy Chellu"
                fill
                priority
                sizes="(max-width: 768px) 240px, 380px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  filter: 'grayscale(10%) brightness(0.90) contrast(1.02)',
                }}
              />
            </div>
            {/* Caption strip */}
            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'block',        // ✅ important
                  width: '100%',           // ✅ important
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                Srirama · AI/ML Engineer
                <br />
                MS Data Science · FSU
              </span>
            </div>
          </motion.div>
        </div>
      </div>{/* end centering wrapper */}

      {/* ── Layer 2: Text content (left) ─────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Badge */}
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <span
            className="glass-3 text-micro"
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              color: 'var(--tint-primary)',
              letterSpacing: '0.10em',
              textTransform: 'capitalize',
              transition: 'color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            AI/ML Engineer - Data Science & Analytics at the Core.
          </span>
        </motion.div>

        {/* Name — refined and restructured */}
        <motion.div variants={fadeUp} style={{ marginBottom: 32, textAlign: 'left' }}>
          <div style={{ height: 'clamp(48px, 8vw, 84px)', position: 'relative', marginBottom: 12 }}>
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
                  fontSize: 'clamp(48px, 8vw, 84px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {HELLO_WORDS[helloIndex]},
              </motion.span>
            </AnimatePresence>
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5.5vw, 64px)',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.1,
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
            fontSize: 'clamp(15px, 1.6vw, 20px)',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Currently {calculateAge('2001-12-16')}, I’m an <span className="text-glass-tint">AI/ML engineer</span> turning complex data into <span className="text-glass-tint">production grade AI systems</span>. Originally from <span className="text-glass-tint">Hyderabad, India</span>, and now building in <span className="text-glass-tint">Los Angeles, California</span>, I work at the intersection of data, infrastructure, and scale. From a <span className="text-glass-tint">Master’s in Data Science</span> at Florida State University to <span className="text-glass-tint">distributed AI architectures</span>, I bridge theory with real world execution.
        </motion.p>

        {/* Social links — iconified */}
        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 16, alignItems: 'center' }}
        >
          {[
            { href: personal.github, icon: <Github size={20} />, label: 'GitHub' },
            { href: personal.linkedin, icon: <Linkedin size={20} />, label: 'LinkedIn' },
            { href: `mailto:${personal.email}`, icon: <Mail size={20} />, label: 'Email' },
          ].map(({ href, icon, label }) => (
            <div key={label} style={{ position: 'relative' }}>
              <motion.a
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="glass-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  color: 'rgba(255,255,255,0.45)',
                  transition: 'color 200ms ease, border-color 200ms ease',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--tint-primary)';
                  e.currentTarget.style.borderColor = 'var(--tint-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {icon}
              </motion.a>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

import { ProjectShowcaseCard } from '@/components/ProjectShowcaseCard';

/* ─── Page Root ───────────────────────────────────────────────── */
export default function HomePage() {
  const { setIsLightboxOpen } = useLightbox();
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    setIsLightboxOpen(selectedPhoto !== null);
  }, [selectedPhoto, setIsLightboxOpen]);

  // Use a shuffled state instead of shuffling on render to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [randomPhotos, setRandomPhotos] = useState<any[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<any[]>([]);

  useEffect(() => {
    // Generate valid shuffled arrays only on the client
    // Balance Photography Grid:
    // We want 3 columns to have equal heights. By interleaving 3 Portraits and 3 Landscapes,
    // the CSS column balancer perfectly allocates 1 Portrait and 1 Landscape per column.
    const allPhotos = [...portfolioData.photography];
    const portraits = allPhotos.filter((p: any) => p.orientation === 'portrait').sort(() => 0.5 - Math.random());
    const landscapes = allPhotos.filter((p: any) => p.orientation === 'landscape').sort(() => 0.5 - Math.random());

    // Pick 3 of each
    const p3 = portraits.slice(0, 3);
    const l3 = landscapes.slice(0, 3);

    // Interleave: P, L, P, L, P, L
    const balancedPhotos = [];
    for (let i = 0; i < 3; i++) {
      if (p3[i]) balancedPhotos.push(p3[i]);
      if (l3[i]) balancedPhotos.push(l3[i]);
    }

    setRandomPhotos(balancedPhotos);
    setRandomRecipes([...portfolioData.cooking].sort(() => 0.5 - Math.random()).slice(0, 3));
    setIsMounted(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', paddingBottom: 160 }}>

      {/* SECTION 1 — Hero */}
      <HeroSection />

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
