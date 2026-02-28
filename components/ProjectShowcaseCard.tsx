import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ArrowRight, Layers, Cpu, BarChart3, RotateCw, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/lib/useIsMobile';

export interface ProjectShowcaseCardProps {
    title: string;
    tagline?: string;
    description: string;
    category: string;
    architecture?: string[];
    impact?: string[];
    stack: string[];
    github?: string | null;
    demo?: string | null;
    image?: string | null;
    index: number;
    variant?: 'compact' | 'full';
    displayType?: 'architectural' | 'visual';
    mobileHeight?: number;
}

export function ProjectShowcaseCard({
    title,
    tagline,
    description,
    category,
    architecture = [],
    impact = [],
    stack,
    github,
    demo,
    image,
    index,
    variant = 'compact',
    displayType = 'architectural',
    mobileHeight
}: ProjectShowcaseCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const isFull = variant === 'full';
    const mainLink = github || demo;
    const isVisual = displayType === 'visual';

    // Front side only shows top 6 items
    // Dynamic count for tech stack display
    const stackDisplayCount = isVisual ? 4 : 6;
    const displayStack = stack.slice(0, stackDisplayCount);

    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    const handleFlip = (e: React.MouseEvent) => {
        // Prevent flip if clicking a link or button
        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
        setIsFlipped(!isFlipped);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
                perspective: 1200,
                width: '100%',
                height: mobile ? (mobileHeight || 480) : 540,
            }}
        >
            <motion.div
                onClick={handleFlip}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* FRONT SIDE */}
                <motion.div
                    className={!isVisual ? (index === 0 ? "glass-3" : "glass-1") : ""}
                    whileHover={!mobile && !isVisual ? { borderColor: 'var(--tint-primary)' } : undefined}
                    whileTap={mobile && !isVisual ? { borderColor: 'var(--tint-primary)' } : undefined}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translateZ(1px)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: isVisual ? 0 : 24,
                        gap: isVisual ? 6 : 0,
                        background: isVisual ? 'transparent' : 'rgba(255,255,255,0.02)',
                        border: isVisual ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: isVisual ? 0 : 20,
                        boxShadow: isVisual ? 'none' : '0 20px 40px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        overflow: isVisual ? 'visible' : 'hidden'
                    }}
                >
                    {isVisual && (
                        <motion.div
                            whileHover={{
                                borderColor: 'var(--tint-primary)',
                                boxShadow: '0 0 40px var(--tint-shadow)'
                            }}
                            style={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                borderRadius: 20,
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                                background: '#000',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt={title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ color: 'rgba(255,255,255,0.1)' }}>
                                    <Layers size={32} />
                                </div>
                            )}
                        </motion.div>
                    )}

                    <motion.div
                        className={isVisual ? (index === 0 ? "glass-3" : "glass-1") : ""}
                        whileHover={!mobile && isVisual ? { borderColor: 'var(--tint-primary)', boxShadow: '0 0 40px var(--tint-shadow)' } : undefined}
                        whileTap={mobile && isVisual ? { borderColor: 'var(--tint-primary)', boxShadow: '0 0 40px var(--tint-shadow)' } : undefined}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: isVisual ? 24 : 0,
                            borderRadius: isVisual ? 20 : 0,
                            background: isVisual ? 'rgba(255,255,255,0.02)' : 'transparent',
                            border: isVisual ? '1px solid rgba(255,255,255,0.08)' : 'none',
                            boxShadow: isVisual ? '0 20px 40px rgba(0,0,0,0.2)' : 'none',
                        }}
                    >
                        {/* Header: Name + GitHub icon on right edge */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                <h3 style={{
                                    fontSize: isVisual ? 18 : 22,
                                    fontWeight: 600,
                                    color: '#fff',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'var(--font-primary)',
                                    lineHeight: 1.2
                                }}>
                                    {title}
                                </h3>
                                {github && (
                                    <motion.a
                                        href={github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={!mobile ? { scale: 1.1, color: '#fff' } : undefined}
                                        whileTap={mobile ? { scale: 1.1, color: '#fff' } : undefined}
                                        style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s', flexShrink: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Github size={18} />
                                    </motion.a>
                                )}
                            </div>
                            {tagline && (
                                <p style={{
                                    fontSize: 14,
                                    color: 'var(--tint-primary)',
                                    marginTop: 4,
                                    fontWeight: 500,
                                    letterSpacing: '0.02em',
                                }}>
                                    {tagline}
                                </p>
                            )}
                        </div>

                        {/* Tech Stack (Top 6) */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, opacity: 0.5 }}>
                                <Cpu size={14} />
                                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Stack</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {displayStack.map(tech => (
                                    <span
                                        key={tech}
                                        style={{
                                            fontSize: 11,
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 500,
                                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {stack.length > stackDisplayCount && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            background: 'rgba(255,255,255,0.01)',
                                            border: '1px dashed rgba(255,255,255,0.1)',
                                            color: 'rgba(255,255,255,0.4)',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        +{stack.length - stackDisplayCount} others
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Impact / Metrics - ONLY ARCHITECTURAL */}
                        {!isVisual && impact.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, opacity: 0.5 }}>
                                    <BarChart3 size={13} />
                                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {impact.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--tint-primary)', opacity: 0.6 }} />
                                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                                                {item}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Architecture - ONLY ARCHITECTURAL */}
                        {!isVisual && architecture.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, opacity: 0.5 }}>
                                    <Layers size={14} />
                                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Components</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {architecture.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--tint-primary)', opacity: 0.6 }} />
                                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ flex: 1 }} />

                        {/* Footer Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16 }}>
                            {mainLink ? (
                                <motion.a
                                    href={mainLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        color: 'var(--tint-primary)',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                    whileHover={!mobile ? { x: 4 } : undefined}
                                    whileTap={mobile ? { x: 4 } : undefined}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View System <ArrowRight size={16} />
                                </motion.a>
                            ) : (
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Internal System</span>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    opacity: 0.4,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Full Stack <RotateCw size={12} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* BACK SIDE */}
                <motion.div
                    whileHover={!mobile ? { borderColor: 'var(--tint-primary)' } : undefined}
                    whileTap={mobile ? { borderColor: 'var(--tint-primary)' } : undefined}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 24,
                        background: 'rgba(20,20,20,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 20,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <BookOpen size={18} style={{ color: 'var(--tint-primary)' }} />
                        <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Engineering Details</h4>
                    </div>

                    <div
                        className="custom-scrollbar"
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            paddingRight: 8,
                            marginBottom: 16
                        }}
                    >
                        <p style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: 24,
                            fontFamily: 'var(--font-primary)'
                        }}>
                            {description}
                        </p>

                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, opacity: 0.5 }}>
                                <Cpu size={14} />
                                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Technical Stack</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {stack.map(tech => (
                                    <span
                                        key={tech}
                                        style={{
                                            fontSize: 11,
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            fontWeight: 500,
                                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: 'auto',
                            paddingTop: 16,
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: 'var(--tint-primary)',
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                        >
                            <RotateCw size={14} /> Back to Overview
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
