import { motion } from 'framer-motion';
import { SkillIcon } from './SkillIcon';

export interface CoreSkillWidgetProps {
    category: string;
    items: { name: string; slug?: string | null }[];
}

export function CoreSkillWidget({ category, items }: CoreSkillWidgetProps) {
    return (
        <motion.div
            className="glass-2 widget-card"
            style={{
                padding: '24px 28px',
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                minWidth: 300,
                flex: '1 1 auto',
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                    className="text-card-title"
                    style={{ color: '#fff', fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}
                >
                    {category}
                </h3>
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'var(--tint-primary)',
                        boxShadow: '0 0 12px var(--tint-primary)',
                        opacity: 0.6,
                    }}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                {items.slice(0, 8).map((item) => (
                    <SkillIcon key={item.name} name={item.name} iconSlug={item.slug ?? undefined} />
                ))}
                {items.length > 8 && (
                    <div
                        className="text-micro"
                        style={{
                            padding: '0 8px',
                            color: 'rgba(255,255,255,0.4)',
                            fontWeight: 500,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        +{items.length - 8}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
