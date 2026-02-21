import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export interface ProjectShowcaseCardProps {
    title: string;
    description: string;
    category: string;
    stack: string[];
    github?: string;
    index: number;
}

export function ProjectShowcaseCard({ title, description, category, stack, github, index }: ProjectShowcaseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
            {/* Visual & Info Container (Internal) */}
            <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                className="glass-1"
                style={{
                    aspectRatio: '16 / 11',
                    borderRadius: 24,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* 1. Visual Asset Area (3/4 Height) */}
                <div style={{
                    flex: 3,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                }}>
                    {/* Abstract visual hint */}
                    <div style={{
                        width: '60%',
                        height: '60%',
                        background: 'radial-gradient(circle, var(--tint-primary) 0%, transparent 70%)',
                        opacity: 0.08,
                        filter: 'blur(40px)',
                    }} />

                    <span style={{
                        position: 'absolute',
                        right: 40,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.2)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                    }}>
                        Awaiting Visual Asset
                    </span>
                </div>

                {/* 2. Internal Details Area (1/4 Height) */}
                <div style={{
                    flex: 1,
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 12,
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                    {/* Top Skills Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {stack.slice(0, 8).map(tech => (
                            <span
                                key={tech}
                                className="glass-3 text-micro"
                                style={{
                                    padding: '5px 12px',
                                    borderRadius: 100,
                                    color: 'rgba(255,255,255,0.6)',
                                    fontWeight: 500,
                                    border: '1px solid rgba(255,255,255,0.08)'
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* 2-line Description */}
                    <p style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.4)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {description}
                    </p>
                </div>
            </motion.div>

            {/* Title & GitHub Section (External) */}
            <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center', gap: 16 }}>
                {github ? (
                    <motion.a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255,255,255,0.9)',
                            textDecoration: 'none'
                        }}
                    >
                        <Github size={16} />
                    </motion.a>
                ) : (
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        <Github size={16} />
                    </div>
                )}

                <h3 style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: '#fff',
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h3>
            </div>
        </motion.div>
    );
}
