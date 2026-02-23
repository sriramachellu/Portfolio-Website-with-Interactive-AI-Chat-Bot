import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface PhotographyShowcaseCardProps {
    photo: any;
    index: number;
    onClick: () => void;
}

export function PhotographyShowcaseCard({ photo, index, onClick }: PhotographyShowcaseCardProps) {
    const [cacheBuster, setCacheBuster] = useState('');

    useEffect(() => {
        setCacheBuster(Date.now().toString());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] as const }}
            whileHover={{ y: -6, scale: 1.01, zIndex: 100 }}
            className="photo-card"
            onClick={onClick}
            style={{
                breakInside: 'avoid',
                marginBottom: 24,
                borderRadius: 20,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <div style={{ position: 'relative', width: '100%', height: 'auto', display: 'flex' }}>
                <img
                    src={`${photo.image}?v=${cacheBuster}`}
                    alt={photo.title}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                    }}
                />

                {/* Overlay */}
                <div
                    className="photo-hover-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 24,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                    }}
                >
                    <p className="text-card-title" style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{photo.title}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className="glass-3 text-micro" style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
                            {photo.category}
                        </span>
                        <span className="glass-3 text-micro" style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
                            {photo.location}
                        </span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .photo-card:hover .photo-hover-overlay {
                    opacity: 1 !important;
                }
            `}</style>
        </motion.div>
    );
}
