import { motion } from 'framer-motion';
import Image from 'next/image';

export interface CookingShowcaseCardProps {
    recipe: any;
    index: number;
}

export function CookingShowcaseCard({ recipe, index }: CookingShowcaseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ width: '100%', breakInside: 'avoid', marginBottom: 24 }}
        >
            <motion.div
                whileHover={{ y: -4, borderColor: 'var(--tint-primary)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                className="glass-1 recipe-card"
                style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 24,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                }}
            >
                {/* Visual Asset Area */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 5',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.2)',
                }}>
                    <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        loading={index < 2 ? "eager" : "lazy"} // Better load balancing
                        priority={index < 2} // Priority restricted to top viewport

                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                        }}
                    />
                </div>

                {/* Description Area */}
                <div style={{
                    padding: '16px 8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <h3 style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        marginBottom: 4
                    }}>
                        {recipe.title}
                    </h3>
                    <p style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.5,
                    }}>
                        {recipe.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {recipe.tags.map((tag: string) => (
                            <span
                                key={tag}
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
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
