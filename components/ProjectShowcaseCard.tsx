import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export interface ProjectShowcaseCardProps {
    title: string;
    description: string;
    category: string;
    stack: string[];
    github?: string | null;
    demo?: string | null;
    image?: string | null;
    index: number;
    variant?: 'compact' | 'full';
}

export function ProjectShowcaseCard({ title, description, category, stack, github, demo, image, index, variant = 'compact' }: ProjectShowcaseCardProps) {
    const isFull = variant === 'full';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ width: '100%' }}
        >
            <motion.div
                whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                className="glass-1"
                style={{
                    aspectRatio: isFull ? 'auto' : '16 / 13',
                    minHeight: isFull ? 480 : 'auto',
                    borderRadius: 24,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 12, // Polaroid border feel
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
            >
                {/* 1. Visual Asset Area (3/4 Height) */}
                <div style={{
                    flex: isFull ? 'none' : 3,
                    aspectRatio: isFull ? '16 / 10' : 'auto',
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.15)', // Darker base for contained images
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8, // Gap around the image inside the frame
                }}>
                    {image ? (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
                        }}>
                            <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{
                                    objectFit: 'contain',
                                    borderRadius: 8, // Round edges of the image itself
                                }}
                                unoptimized={true}
                            />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Awaiting Visual Asset
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. Internal Details Area (1/4 Height) */}
                <div style={{
                    flex: 1.2, // Slightly more than 1/4 to accommodate title comfortably
                    padding: '16px 8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 600,
                                color: '#fff',
                                letterSpacing: '-0.02em',
                                marginBottom: 4
                            }}>
                                {title}
                            </h3>
                            <p style={{
                                fontSize: isFull ? 14 : 12,
                                color: 'rgba(255,255,255,0.45)',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: isFull ? 'initial' : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: isFull ? 'visible' : 'hidden',
                            }}>
                                {description}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            {github && (
                                <motion.a
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.9)',
                                    }}
                                >
                                    <Github size={18} />
                                </motion.a>
                            )}

                            {demo && (
                                <motion.a
                                    href={demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, background: 'var(--tint-glass)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--tint-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--tint-primary)',
                                    }}
                                >
                                    <ExternalLink size={18} />
                                </motion.a>
                            )}
                        </div>
                    </div>

                    {/* Bottom Tech Stack */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {stack.slice().map(tech => (
                            <span
                                key={tech}
                                style={{
                                    fontSize: 10,
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontWeight: 500,
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>

    );
}
