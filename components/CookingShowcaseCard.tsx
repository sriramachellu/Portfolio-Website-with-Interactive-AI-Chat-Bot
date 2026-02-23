import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface CookingShowcaseCardProps {
    recipe: any;
    index: number;
}

export function CookingShowcaseCard({ recipe, index }: CookingShowcaseCardProps) {
    const [cacheBuster, setCacheBuster] = useState('');

    useEffect(() => {
        setCacheBuster(Date.now().toString());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
            whileHover={{ y: -6, scale: 1.01, zIndex: 100 }}
            className="recipe-card"
            style={{
                breakInside: 'avoid',
                marginBottom: 24,
                cursor: 'default',
                position: 'relative',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px) saturate(140%)',
                WebkitBackdropFilter: 'blur(24px) saturate(140%)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 18,
                padding: '12px 12px 24px 12px', // Polaroid framing
                boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
            }}
        >
            {/* Polaroid Image Container */}
            <div style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)'
            }}>
                <img
                    src={`${recipe.image}?v=${cacheBuster}`}
                    alt={recipe.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            </div>

            {/* Description Area */}
            <div style={{ paddingTop: 20, paddingInline: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 className="text-card-title" style={{ color: '#fff', fontSize: 18 }}>{recipe.title}</h3>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontSize: 13 }}>
                    {recipe.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {recipe.tags.map((tag: string) => (
                        <span key={tag} className="glass-3 text-micro" style={{ padding: '4px 10px', color: 'var(--tint-primary)', fontWeight: 600 }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
