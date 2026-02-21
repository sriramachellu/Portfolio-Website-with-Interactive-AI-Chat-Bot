'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

function TimeWidget() {
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
                padding: '6px 10px',
                borderRadius: 12,
                minWidth: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
            }}
        >
            <div>
                <p
                    style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--tint-primary)',
                        marginBottom: 3,
                    }}
                >
                    <span style={{ color: '#fff', opacity: 0.85 }}>
                        Timezone:
                    </span>
                    {MY_LABEL}
                </p>

                <p
                    style={{
                        fontSize: 16,
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
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e88',
                }}
            />
        </motion.div>
    );
}

/* ---------- AQI WIDGET ---------- */

function AQIWidget() {
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
                padding: '6px 10px',
                borderRadius: 12,
                minWidth: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <p
                style={{
                    fontSize: 8,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 3,
                }}
            >
                <span style={{ color: '#fff', opacity: 0.85 }}>
                    Current Location:
                </span>
                <span
                    style={{
                        color: 'var(--tint-primary)',
                        marginLeft: 4,
                        transition: 'color 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                >
                    Los Angeles, California
                </span>
            </p>

            <p
                style={{
                    fontSize: 16,
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
    return (
        <div
            style={{
                position: 'absolute',
                top: 28,
                left: 28,
                display: 'flex',
                gap: 16,
                zIndex: 4,
            }}
        >
            <TimeWidget />
            <AQIWidget />
        </div>
    );
}