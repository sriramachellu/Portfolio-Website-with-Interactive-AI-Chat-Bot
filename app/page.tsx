'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';
import { TopInfoBar } from '@/components/TimeZoneWidget';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
const { personal } = portfolioData;

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

import { ResponsiveLayoutWrapper } from '@/components/ResponsiveLayoutWrapper';

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
    <ResponsiveLayoutWrapper
      heroSection={<HeroSection />}
      isMounted={isMounted}
      randomPhotos={randomPhotos}
      randomRecipes={randomRecipes}
      selectedPhoto={selectedPhoto}
      setSelectedPhoto={setSelectedPhoto}
    />
  );
}
