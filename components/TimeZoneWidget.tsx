'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';

const MY_TZ = 'America/Los_Angeles';
const MY_LABEL = ' PST';

/* ---------- Helpers ---------- */

function getTimeParts(date: Date, tz: string) {
    return date.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

/* ---------- TIME WIDGET ---------- */

function TimeWidget({ compact }: { compact?: boolean }) {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!now) return null;

    const myTime = getTimeParts(now, MY_TZ);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-2"
            style={{
                padding: compact ? '4px 8px' : '6px 10px',
                borderRadius: compact ? 10 : 12,
                minWidth: compact ? 70 : 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: compact ? 8 : 14,
            }}
        >
            <div>
                <p
                    style={{
                        fontSize: compact ? 7 : 9,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--tint-primary)',
                        marginBottom: compact ? 2 : 3,
                    }}
                >
                    <span style={{ color: '#fff', opacity: 0.85 }}>
                        Timezone:
                    </span>
                    {MY_LABEL}
                </p>

                <p
                    style={{
                        fontSize: compact ? 12 : 16,
                        fontWeight: 500,
                        color: '#fff',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1,
                    }}
                >
                    {myTime}
                </p>
            </div>

            <span
                style={{
                    width: compact ? 5 : 7,
                    height: compact ? 5 : 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e88',
                }}
            />
        </motion.div>
    );
}

/* ---------- AQI WIDGET ---------- */

function AQIWidget({ compact }: { compact?: boolean }) {
    const [aqi, setAqi] = useState<number | null>(null);

    useEffect(() => {
        async function fetchAQI() {
            try {
                const res = await fetch('/api/chat/aqi');
                const data = await res.json();
                setAqi(data.aqi ?? null);
            } catch {
                setAqi(null);
            }
        }

        fetchAQI();
        const interval = setInterval(fetchAQI, 600000); // 10 mins

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-2"
            style={{
                padding: compact ? '4px 8px' : '6px 10px',
                borderRadius: compact ? 10 : 12,
                minWidth: compact ? 70 : 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <p
                style={{
                    fontSize: compact ? 6 : 8,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: compact ? 2 : 3,
                }}
            >
                <span style={{ color: '#fff', opacity: 0.85 }}>
                    {compact ? 'Location: ' : 'Current Location:'}
                </span>
                <span
                    style={{
                        color: 'var(--tint-primary)',
                        marginLeft: 4,
                        transition: 'color 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                >
                    {compact ? 'LA, CA' : 'Los Angeles, California'}
                </span>
            </p>

            <p
                style={{
                    fontSize: compact ? 12 : 16,
                    fontWeight: 500,
                    color:
                        aqi !== null
                            ? aqi <= 50
                                ? 'var(--tint-primary)' // reacts to theme
                                : aqi <= 100
                                    ? '#facc15'
                                    : '#ef4444'
                            : '#fff',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    transition: 'color 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
            >
                AQI: {aqi ?? '--'}
            </p>
        </motion.div>
    );
}

/* ---------- WRAPPER (Side by Side) ---------- */

export function TopInfoBar() {
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    return (
        <div
            style={{
                position: 'absolute',
                top: mobile ? 14 : 28,
                left: mobile ? 14 : 28,
                display: 'flex',
                gap: mobile ? 6 : 16,
                zIndex: 4,
            }}
        >
            <TimeWidget compact={mobile} />
            <AQIWidget compact={mobile} />
        </div>
    );
}