'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Send, Phone, Rocket, Link2, Briefcase, Linkedin, Github, X, LucideIcon } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';

const DYNAMIC_CTA = [
    { text: "Say Hello", icon: Mail },
    { text: "Contact Me", icon: MessageSquare },
    { text: "Send Mail", icon: Send },
    { text: "Get In Touch", icon: Phone },
    { text: "Start", icon: Rocket },
    { text: "Connect", icon: Link2 },
    { text: "Open To Hire", icon: Briefcase },
];

function ContactLinkIcon({ link, index }: { link: { name: string, icon: LucideIcon, url: string, color: string }, index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                textDecoration: 'none', color: link.color,
                position: 'relative'
            }}
            title={link.name}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: 'absolute', inset: -1, borderRadius: '50%',
                    border: '1px solid var(--tint-primary)',
                    boxShadow: '0 0 12px var(--tint-primary)',
                    pointerEvents: 'none', zIndex: 0
                }}
            />
            <link.icon size={22} style={{ zIndex: 1, position: 'relative' }} />
        </motion.a>
    );
}

function MainContactButton({ onClick, ctaIndex }: { onClick: () => void, ctaIndex: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="glass-2"
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: 52, width: 200, borderRadius: 100,
                color: '#fff', fontSize: 15, fontWeight: 500, textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
        >
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: 'absolute', inset: -1, borderRadius: 100,
                    border: '1px solid var(--tint-primary)',
                    boxShadow: '0 0 24px var(--tint-primary)',
                    pointerEvents: 'none', zIndex: 0
                }}
            />
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={ctaIndex}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'absolute', zIndex: 1 }}
                >
                    {(() => {
                        const IconNode = DYNAMIC_CTA[ctaIndex].icon;
                        return <IconNode size={18} style={{ color: 'var(--tint-primary)' }} />;
                    })()}
                    {DYNAMIC_CTA[ctaIndex].text}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}

export default function ContactSection() {
    const [ctaIndex, setCtaIndex] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        // Rotate dynamically very fast as requested
        const timer = setInterval(() => {
            setCtaIndex((prev) => (prev + 1) % DYNAMIC_CTA.length);
        }, 1200);
        return () => clearInterval(timer);
    }, []);

    const contactLinks = [
        { name: 'Email', icon: Mail, url: `mailto:${portfolioData.personal.email}`, color: '#ea4335' },
        { name: 'LinkedIn', icon: Linkedin, url: portfolioData.personal.linkedin, color: '#0a66c2' },
        { name: 'GitHub', icon: Github, url: portfolioData.personal.github, color: '#ffffff' },
        { name: 'Phone', icon: Phone, url: 'tel:8505596563', color: '#34a853' },
    ].filter(link => link.url && link.url !== '#' && link.url !== 'tel:'); // Only show if valid URL

    return (
        <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px)', textAlign: 'center' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <motion.h2
                    className="text-section"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    style={{ color: '#fff', marginBottom: 24, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}
                >
                    Ready to build{' '}
                    <span className="text-glass-tint" style={{ transition: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        Intelligent Systems
                    </span>{' '}
                    together?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                    style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}
                >
                    Let's build intelligent systems together. I'm always open to discussing new projects, collaborations, or opportunities to apply AI and data engineering to real world problems.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <MainContactButton onClick={() => setIsPopupOpen(true)} ctaIndex={ctaIndex} />
                </motion.div>
            </div>

            {/* Expandable Contact Container */}
            <AnimatePresence>
                {isPopupOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', width: '100%' }}
                    >
                        <div style={{ padding: '4px 4px 40px 4px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div
                                className="glass-1 widget-card"
                                style={{
                                    width: '100%', maxWidth: 400, padding: '24px 32px', borderRadius: 24,
                                    textAlign: 'center', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative'
                                }}
                            >
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    style={{
                                        position: 'absolute', top: 16, right: 16,
                                        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <X size={18} />
                                </button>

                                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>
                                    Let's <span className="text-glass-tint">Connect</span>
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>
                                    Reach out via your preferred platform.
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                                    {contactLinks.map((link, i) => (
                                        <ContactLinkIcon key={link.name} link={link} index={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
