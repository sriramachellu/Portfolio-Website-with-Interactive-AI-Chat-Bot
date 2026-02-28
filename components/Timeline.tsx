import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useIsMobile } from '@/lib/useIsMobile';

export interface TimelineItemData {
    role: string;
    company: string;
    duration: string;
    location: string;
    image?: string;
    imageCaption?: string;
    imageYears?: string;
    bullets?: string[];
}

export interface TimelineProps {
    items: TimelineItemData[];
    showBullets?: boolean;
    showRedirection?: boolean;
}



export function Timeline({ items, showBullets = true, showRedirection = false }: TimelineProps) {
    const [cacheBuster, setCacheBuster] = useState('');
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    useEffect(() => {
        setCacheBuster(Date.now().toString());
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: 1000, margin: '0 auto', padding: '40px 0' }}>

            {/* Center Glass Line */}
            <div
                className="timeline-line"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: 'translateX(-50%)',
                    width: 2,
                    height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, transparent)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 0,
                }}
            />

            {items.map((item, index) => {
                const isLeftText = index % 2 === 0;
                const itemId = item.company.toLowerCase().replace(/[^a-z0-9]/g, '-');

                return (
                    <motion.div
                        key={index}
                        id={itemId}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 100,
                            zIndex: 1,
                        }}
                    >
                        {/* Center Node on the Line */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.3, type: 'spring' }}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: -7,
                                marginTop: -7,
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                background: 'var(--tint-primary)',
                                boxShadow: '0 0 16px var(--tint-primary)',
                                border: '2px solid rgba(255,255,255,0.8)',
                                zIndex: 2,
                            }}
                        />

                        {/* LEFT SIDE CONTENT */}
                        <div style={{ width: 'calc(50% - 40px)', display: 'flex', justifyContent: 'flex-end' }}>
                            {isLeftText ? (
                                // Text on Left
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                                        {item.role}
                                        {showRedirection && (
                                            <Link href={`/work#${itemId}`} style={{ display: 'inline-flex', marginLeft: 8, color: 'var(--tint-primary)', verticalAlign: 'middle' }}>
                                                <motion.div whileHover={{ scale: 1.2, x: 2, y: -2 }}>
                                                    <ArrowUpRight size={16} />
                                                </motion.div>
                                            </Link>
                                        )}
                                    </h3>
                                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tint-primary)', marginBottom: 8 }}>
                                        {item.company}
                                    </span>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                                        {item.duration}
                                    </span>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
                                        {item.location}
                                    </span>

                                    {showBullets && item.bullets && item.bullets.length > 0 && (
                                        <ul style={{
                                            paddingLeft: 0,
                                            listStyle: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 8,
                                            marginTop: 16,
                                            alignItems: 'flex-end'
                                        }}>
                                            {item.bullets.map((bullet, bi) => (
                                                <li key={bi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end', textAlign: 'right' }}>
                                                    <p className="text-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{bullet}</p>
                                                    <span style={{ color: 'var(--tint-primary)', marginTop: 6, flexShrink: 0 }}>
                                                        <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                                                            <circle cx="3" cy="3" r="3" />
                                                        </svg>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                // Image on Left
                                <motion.div
                                    whileHover={!mobile ? { scale: 1.05, rotate: 0, borderColor: 'var(--tint-primary)' } : undefined}
                                    whileTap={mobile ? { scale: 1.05, rotate: 0, borderColor: 'var(--tint-primary)' } : undefined}
                                    style={{
                                        width: 220,
                                        height: 184,
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 12,
                                        padding: '8px 8px 12px 8px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        position: 'relative',
                                        rotate: -2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12
                                    }}
                                >
                                    <div style={{ flex: 1, width: '100%', borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                        {item.image ? (
                                            <>
                                                <Image
                                                    src={`${item.image}?v=${cacheBuster}`}
                                                    alt={item.company}
                                                    fill
                                                    quality={90}
                                                    sizes="220px"
                                                    priority={index < 2}
                                                    unoptimized={true}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                {/* Subtle inner glass overlay for blending */}
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2))',
                                                    pointerEvents: 'none'
                                                }} />
                                            </>
                                        ) : (
                                            <span style={{ fontSize: 24, fontWeight: 600, background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.5 }}>
                                                {(item.imageCaption || item.company).charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ width: '100%', textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
                                        {item.imageCaption ? (
                                            <>
                                                <span style={{ color: '#fff' }}>{item.imageCaption}</span>
                                                {item.imageYears && <><br /><span style={{ fontSize: 10, opacity: 0.7 }}>{item.imageYears}</span></>}
                                            </>
                                        ) : (
                                            item.company
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div style={{ width: 'calc(50% - 40px)', display: 'flex', justifyContent: 'flex-start' }}>
                            {!isLeftText ? (
                                // Text on Right
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                                        {item.role}
                                        {showRedirection && (
                                            <Link href={`/work#${itemId}`} style={{ display: 'inline-flex', marginLeft: 8, color: 'var(--tint-primary)', verticalAlign: 'middle' }}>
                                                <motion.div whileHover={{ scale: 1.2, x: 2, y: -2 }}>
                                                    <ArrowUpRight size={16} />
                                                </motion.div>
                                            </Link>
                                        )}
                                    </h3>
                                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tint-primary)', marginBottom: 8 }}>
                                        {item.company}
                                    </span>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                                        {item.duration}
                                    </span>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
                                        {item.location}
                                    </span>

                                    {showBullets && item.bullets && item.bullets.length > 0 && (
                                        <ul style={{
                                            paddingLeft: 0,
                                            listStyle: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 8,
                                            marginTop: 16,
                                            alignItems: 'flex-start'
                                        }}>
                                            {item.bullets.map((bullet, bi) => (
                                                <li key={bi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left' }}>
                                                    <span style={{ color: 'var(--tint-primary)', marginTop: 6, flexShrink: 0 }}>
                                                        <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                                                            <circle cx="3" cy="3" r="3" />
                                                        </svg>
                                                    </span>
                                                    <p className="text-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{bullet}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                // Image on Right
                                <motion.div
                                    whileHover={!mobile ? { scale: 1.05, rotate: 0, borderColor: 'var(--tint-primary)' } : undefined}
                                    whileTap={mobile ? { scale: 1.05, rotate: 0, borderColor: 'var(--tint-primary)' } : undefined}
                                    style={{
                                        width: 220,
                                        height: 184,
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 12,
                                        padding: '8px 8px 12px 8px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        position: 'relative',
                                        rotate: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12
                                    }}
                                >
                                    <div style={{ flex: 1, width: '100%', borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                        {item.image ? (
                                            <>
                                                <Image
                                                    src={`${item.image}?v=${cacheBuster}`}
                                                    alt={item.company}
                                                    fill
                                                    quality={90}
                                                    sizes="220px"
                                                    priority={index < 2}
                                                    unoptimized={true}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                {/* Subtle inner glass overlay for blending */}
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2))',
                                                    pointerEvents: 'none'
                                                }} />
                                            </>
                                        ) : (
                                            <span style={{ fontSize: 24, fontWeight: 600, background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.5 }}>
                                                {(item.imageCaption || item.company).charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ width: '100%', textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
                                        {item.imageCaption ? (
                                            <>
                                                <span style={{ color: '#fff' }}>{item.imageCaption}</span>
                                                {item.imageYears && <><br /><span style={{ fontSize: 10, opacity: 0.7 }}>{item.imageYears}</span></>}
                                            </>
                                        ) : (
                                            item.company
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                    </motion.div>
                );
            })}
        </div>
    );
}

