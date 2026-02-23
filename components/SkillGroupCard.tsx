import { motion } from 'framer-motion';
import { SkillIcon } from './SkillIcon';

export interface SkillGroupCardProps {
    category: string;
    desc?: string;
    items: { name: string; slug?: string | null }[];
    variants?: any;
}

export function SkillGroupCard({ category, desc, items, variants }: SkillGroupCardProps) {
    const iconItems = items.filter(item => item.slug);
    const pillItems = items.filter(item => !item.slug);

    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -6, scale: 1.01, zIndex: 100 }} // Higher z-index to stay on top
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="glass-1 widget-card"
            style={{
                padding: '40px 28px 24px 28px', // Increased top padding for tooltip headroom
                borderRadius: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                marginBottom: 24,
                breakInside: 'avoid',
                cursor: 'default',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            {/* Visuals Section (Top) */}
            {(iconItems.length > 0 || pillItems.length > 0) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Icons Grid */}
                    {iconItems.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                            {iconItems.map((item) => (
                                <SkillIcon key={item.name} name={item.name} iconSlug={item.slug as string} />
                            ))}
                        </div>
                    )}

                    {/* Text Pills */}
                    {pillItems.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {pillItems.map((item) => (
                                <span
                                    key={item.name}
                                    className="glass-3 text-micro"
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 100,
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: 500,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Text Section (Bottom) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3
                    style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {category}
                </h3>
                {desc && (
                    <p
                        style={{
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.5,
                        }}
                    >
                        {desc}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
