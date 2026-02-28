'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';

interface NowPlayingTrack {
    album?: string;
    albumImageUrl?: string;
    artist?: string;
    isPlaying: boolean;
    songUrl?: string;
    title?: string;
}

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState<NowPlayingTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    const fetchTrack = async () => {
        try {
            const res = await fetch('/api/now-playing');
            if (res.ok) {
                const data = await res.json();
                setTrack(data);
            }
        } catch (error) {
            console.error('Spotify fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrack();
        const interval = setInterval(fetchTrack, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !track?.isPlaying) return null;

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-2"
            style={{
                position: 'absolute',
                top: mobile ? 56 : 72,
                ...(mobile ? { left: 14 } : { right: 24 }),
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: mobile ? 8 : 12,
                padding: mobile ? '5px 10px' : '8px 14px',
                borderRadius: 100,
                maxWidth: mobile ? 180 : 280,
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer'
            }}
            onClick={() => track.songUrl && window.open(track.songUrl, '_blank')}
        >
            {/* Playing Animation */}
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 12, width: 14 }}>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, 12, 6, 12, 4] }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                        }}
                        style={{
                            width: 3,
                            background: 'var(--tint-primary)',
                            borderRadius: 1,
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <span
                    className="text-micro"
                    style={{
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 600,
                    }}
                >
                    {track.title}
                </span>
                <span
                    className="text-micro"
                    style={{
                        color: 'rgba(255,255,255,0.45)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: 10,
                    }}
                >
                    {track.artist}
                </span>
            </div>

            {/* Album Art Mini */}
            {track.albumImageUrl && (
                <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    <img
                        src={track.albumImageUrl}
                        alt={track.album}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}
        </motion.div>
    );
}
