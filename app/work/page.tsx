'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import portfolioData from '@/lib/portfolio.json';

const { workExperience } = portfolioData;

export default function WorkPage() {
    return (
        <div style={{ minHeight: '100vh', padding: '100px 40px 160px', maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 72 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Career
                </p>
                <h1 className="text-section" style={{ color: '#fff' }}>Work</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 480 }}>
                    Building at the frontier of AI — from research infrastructure to user-facing products.
                </p>
            </motion.div>

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'absolute',
                        left: 19,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: 'linear-gradient(to bottom, var(--tint-primary), transparent)',
                        transformOrigin: 'top',
                        borderRadius: 2,
                    }}
                />

                {workExperience.map((job, i) => (
                    <motion.div
                        key={job.company}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        style={{ display: 'flex', gap: 32, marginBottom: 40, position: 'relative' }}
                    >
                        {/* Dot */}
                        <div style={{ flexShrink: 0, marginTop: 24 }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'var(--tint-glass)',
                                    border: '2px solid var(--tint-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 15,
                                    color: 'var(--tint-primary)',
                                    fontWeight: 700,
                                }}
                            >
                                {i + 1}
                            </motion.div>
                        </div>

                        {/* Card */}
                        <div
                            className="glass-2 card-hover"
                            style={{ flex: 1, padding: '28px 28px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                                <div>
                                    <h3 className="text-card-title" style={{ color: '#fff' }}>{job.role}</h3>
                                    <p style={{ color: 'var(--tint-primary)', fontWeight: 600, fontSize: 15, marginTop: 2 }}>{job.company}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                    <span className="glass-3 text-micro" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 100, color: 'rgba(255,255,255,0.60)' }}>
                                        <Calendar size={11} /> {job.duration}
                                    </span>
                                    <span className="glass-3 text-micro" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 100, color: 'rgba(255,255,255,0.60)' }}>
                                        <MapPin size={11} /> {job.location}
                                    </span>
                                </div>
                            </div>

                            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                                {job.bullets.map((bullet, bi) => (
                                    <li key={bi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <span style={{ color: 'var(--tint-primary)', marginTop: 6 }}>
                                            <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                                                <circle cx="3" cy="3" r="3" />
                                            </svg>
                                        </span>
                                        <p className="text-body" style={{ color: 'rgba(255,255,255,0.68)' }}>{bullet}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
