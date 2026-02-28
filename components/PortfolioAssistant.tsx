'use client';

import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import {
    motion, useAnimation, AnimatePresence,
    useScroll, useVelocity, useTransform, useSpring, useMotionValue,
} from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/useIsMobile';

/* ─── Types ──────────────────────────────────────────────────── */
type BotState = 'landing' | 'arrival' | 'cursor-follow' | 'idle' | 'dock' | 'typing' | 'inactive';
type BotAction = 'MOVE' | 'STOP' | 'STAY' | 'FOCUS' | 'TYPE' | 'SEND' | 'CLOSE' | 'INACTIVE';
type Message = { role: 'user' | 'assistant'; text: string };

function botReducer(state: BotState, action: BotAction): BotState {
    switch (action) {
        case 'MOVE':
            if (state === 'dock' || state === 'typing') return state;
            return 'cursor-follow';
        case 'STOP':
            if (state === 'dock' || state === 'typing') return state;
            return 'arrival';
        case 'STAY':
            if (state === 'arrival') return 'idle';
            return state;
        case 'FOCUS': return 'dock';
        case 'TYPE': return 'typing';
        case 'SEND': return 'dock';
        case 'CLOSE': return 'idle';
        case 'INACTIVE': return 'inactive';
        default: return state;
    }
}

/* ─── Markdown renderer ─────────────────────────────────────── */
function renderInline(text: string): React.ReactNode[] {
    return text.split(/\*\*([^*]+)\*\*|\*([^*]+)\*/).map((part, i) => {
        // The regex alternates: plain, **bold**, *italic*, plain...
        if (i % 3 === 1) return <strong key={i} style={{ fontWeight: 650, color: 'rgba(255,255,255,0.95)' }}>{part}</strong>;
        if (i % 3 === 2) return <em key={i} style={{ fontStyle: 'italic' }}>{part}</em>;
        return part as unknown as React.ReactNode;
    });
}

function renderMd(text: string): React.ReactNode {
    const lines = text.split('\n');
    const out: React.ReactNode[] = [];
    let listBuf: React.ReactNode[] = [];

    const flushList = () => {
        if (listBuf.length) {
            out.push(
                <ul key={`ul-${out.length}`} style={{ margin: '4px 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {listBuf}
                </ul>
            );
            listBuf = [];
        }
    };

    lines.forEach((line, i) => {
        const bullet = line.match(/^\s*[\*\-\u2022]\s+(.+)/);
        if (bullet) {
            listBuf.push(
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--tint-primary)', flexShrink: 0, lineHeight: 1.55, transition: 'color 600ms' }}>•</span>
                    <span>{renderInline(bullet[1])}</span>
                </li>
            );
        } else {
            flushList();
            if (line.trim()) {
                out.push(<p key={i} style={{ margin: '2px 0', lineHeight: 1.55 }}>{renderInline(line)}</p>);
            }
        }
    });
    flushList();
    return <>{out}</>;
}

/* ─── Robot visual ───────────────────────────────────────────── */
function GlassRobot({ state }: { state: BotState }) {
    const isTyping = state === 'typing';
    const isIdle = state === 'idle' || state === 'arrival';
    const isDocked = state === 'dock' || state === 'typing';

    return (
        <motion.div
            animate={
                isTyping ? { rotate: [-1.5, 1.5, -1.5] }
                    : isIdle ? { y: [0, -3, 0] }
                        : { rotate: 0, y: 0 }
            }
            transition={
                isTyping ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
                    : isIdle ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.4 }
            }
            style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(140deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.07) 55%, rgba(255,255,255,0.13) 100%)',
                backdropFilter: 'blur(14px) saturate(150%)',
                WebkitBackdropFilter: 'blur(14px) saturate(150%)',
                border: '1px solid rgba(255,255,255,0.22)',
                position: 'relative', display: 'flex', alignItems: 'center',
                justifyContent: 'center', overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.07) inset',
            }}
        >
            {/* Specular highlight */}
            <div style={{
                position: 'absolute', top: 7, left: 8, width: 13, height: 7,
                borderRadius: '50%', background: 'rgba(255,255,255,0.48)',
                filter: 'blur(2px)', pointerEvents: 'none',
            }} />

            {/* Eyes */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {[0, 1].map((i) => (
                    <motion.div
                        key={i}
                        animate={(isTyping || isIdle) ? {
                            scaleY: [1, 0.15, 1],
                            transition: { duration: 0.28, delay: i * 0.12, repeat: Infinity, repeatDelay: 2 },
                        } : { scaleY: 1 }}
                        style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.92)',
                            boxShadow: isDocked || isTyping || isIdle
                                ? '0 0 8px var(--tint-primary)'
                                : '0 0 4px rgba(255,255,255,0.4)',
                        }}
                    />
                ))}
            </div>

            {/* Antenna */}
            <div style={{
                position: 'absolute', top: -6, left: '50%', marginLeft: -2,
                width: 4, height: 8, borderRadius: 2,
                background: 'rgba(255,255,255,0.35)',
            }} />
        </motion.div>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export function PortfolioAssistant() {
    const pathname = usePathname();
    const [botState, dispatch] = useReducer(botReducer, 'landing');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatVisible, setChatVisible] = useState(false);
    const [barVisible, setBarVisible] = useState(true);
    const [hasCursor, setHasCursor] = useState(false);
    const [showHi, setShowHi] = useState(true);
    const [isLanding, setIsLanding] = useState(true);

    const robotControls = useAnimation();
    const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mouseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEnd = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const robotRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const isGameHoveredRef = useRef(false);

    useEffect(() => {
        const handleGameHover = (e: any) => {
            isGameHoveredRef.current = e.detail;
        };
        window.addEventListener('game-hover', handleGameHover);
        return () => window.removeEventListener('game-hover', handleGameHover);
    }, []);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springX = useSpring(cursorX, { stiffness: 250, damping: 25 });
    const springY = useSpring(cursorY, { stiffness: 250, damping: 25 });

    const isActive = botState === 'dock' || botState === 'typing';
    const isMobile = useIsMobile();
    const mobile = isMobile === true;
    const hideBotOnMobile = mobile && pathname === '/';

    useEffect(() => {
        // Safe check for window for initial value
        if (typeof window !== 'undefined' && mouseRef.current.x === 0) {
            mouseRef.current = { x: window.innerWidth * 0.47, y: window.innerHeight - 188 };
        }
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (isGameHoveredRef.current) return;

            if (!hasCursor) {
                setHasCursor(true);
                setShowHi(false);
                setIsLanding(false);
            }

            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            mouseRef.current = { x: clientX, y: clientY };
            dispatch('MOVE');

            // Reset stop timers
            if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
            if (stayTimerRef.current) clearTimeout(stayTimerRef.current);

            mouseTimerRef.current = setTimeout(() => {
                dispatch('STOP');
            }, 800);

            if (botState === 'cursor-follow' || botState === 'inactive' || botState === 'arrival' || botState === 'idle') {
                const anchorX = window.innerWidth / 2;
                const anchorY = window.innerHeight - (mobile ? 144 : 108) - 22;

                cursorX.set(clientX - anchorX);
                cursorY.set(clientY - anchorY);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        // window.addEventListener('touchstart', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            // window.removeEventListener('touchstart', handleMouseMove);
        }
    }, [botState, hasCursor, cursorX, cursorY]);

    useEffect(() => {
        if (botState === 'dock' || botState === 'typing') {
            cursorX.set(0);
            cursorY.set(0);
        } else if (hasCursor) {
            const anchorX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
            const anchorY = typeof window !== 'undefined' ? window.innerHeight - (mobile ? 144 : 108) - 22 : 0;
            cursorX.set(mouseRef.current.x - anchorX);
            cursorY.set(mouseRef.current.y - anchorY);
        }
    }, [botState, hasCursor, cursorX, cursorY, mobile]);

    /* ── Opacity ─────────────────────────────── */
    const containerOpacity = 1;

    /* ── Robot position constants ──────────────────────────────── */
    // Anchor: position:fixed, bottom:108px, left:50%, marginLeft:-22px
    // Home = right side near polaroid  (x = positive offset)
    // Dock = left of 440px chat bar    (x = -(220 + 10 + 22) = -252)
    const HOME_X = 'calc(47vw - 22px)';
    const HOME_Y = -80;
    const DOCK_X = -202;
    const DOCK_Y = 8;

    /* ── Landing sequence logic ────────────────────────────── */
    useEffect(() => {
        // Start immediately in landing/arrival
        // After 5s, hide "Hi"
        const hiTimer = setTimeout(() => setShowHi(false), 5000);
        // After 10s, if still landing (no cursor), fade out
        const landTimer = setTimeout(() => setIsLanding(false), 10000);

        return () => {
            clearTimeout(hiTimer);
            clearTimeout(landTimer);
        };
    }, []);

    /* ── State → robot position ────────────────────────────────── */
    useEffect(() => {
        switch (botState) {
            case 'landing':
            case 'arrival':
            case 'idle': {
                if (!hasCursor) {
                    // Peek position: static above hero polaroid
                    robotControls.start({
                        x: mobile ? 0 : 'calc(28vw)',
                        y: mobile ? 'calc(-100dvh + 300px)' : 'calc(-50vh - 160px)',
                        scale: 0.7,
                        opacity: isLanding ? 0.85 : 0,
                        transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
                    });
                } else {
                    robotControls.start({
                        x: 0, y: 0,
                        scale: 0.88, opacity: 0.85,
                        transition: {
                            duration: botState === 'arrival' ? 0.8 : 0.55,
                            ease: [0.22, 1, 0.36, 1] as const
                        },
                    }).then(() => {
                        if (botState === 'arrival') {
                            stayTimerRef.current = setTimeout(() => dispatch('STAY'), 500);
                        }
                    });
                }
                break;
            }
            case 'cursor-follow':
                robotControls.start({
                    x: 0, y: 0, scale: 0.88, opacity: 0.85,
                    transition: { duration: 0.3 }
                });
                break;
            case 'dock':
                robotControls.start({
                    x: mobile ? -154 : DOCK_X,
                    y: DOCK_Y,
                    scale: 1.05, opacity: 1,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                });
                break;
            case 'typing':
                robotControls.start({
                    x: mobile ? -154 : DOCK_X,
                    y: DOCK_Y,
                    scale: 1.05, opacity: 1,
                    transition: { duration: 0.3 },
                });
                break;
            case 'inactive': {
                if (!hasCursor) {
                    robotControls.start({
                        x: 'calc(28vw)', y: 'calc(-50vh - 160px)', scale: 0.65, opacity: 0.45,
                        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
                    });
                } else {
                    robotControls.start({
                        x: 0, y: 0,
                        scale: 0.78, opacity: 0.45,
                        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
                    });
                }
                break;
            }
        }
    }, [botState, robotControls, hasCursor, isLanding, mobile, messages.length]);

    /* ── Inactivity timer ──────────────────────────────────────── */
    const resetInactivity = useCallback(() => {
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => {
            dispatch('INACTIVE');
            setChatVisible(false); // hide panel, but keep messages for resume
        }, 60_000);           // 60s — enough time to read a response
    }, []);

    useEffect(() => {
        if (botState !== 'landing') resetInactivity();
        return () => { if (inactivityRef.current) clearTimeout(inactivityRef.current); };
    }, [botState, resetInactivity]);

    /* ── Auto-scroll ───────────────────────────────────────────── */
    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    /* ── Handlers ──────────────────────────────────────────────── */
    const handleFocus = () => {
        dispatch('FOCUS');
        setChatVisible(true);
        resetInactivity();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        dispatch('TYPE');
        resetInactivity();
    };

    const handleBlur = () => {
        // Only update bot state — do NOT close the chat panel.
        // Messages stay visible so user can keep reading.
        // We don't have BLUR action anymore, it transitions automatically via STOP/MOVE
    };

    const handleClose = () => {
        // Only explicit close clears messages
        setMessages([]);
        setError(null);
        setInput('');
        setChatVisible(false);
        dispatch('CLOSE');
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!chatVisible) return;
            const target = e.target as Node;
            if (chatRef.current?.contains(target) || robotRef.current?.contains(target)) {
                return;
            }
            handleClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [chatVisible]);

    // Re-open existing conversation when user focuses the input again
    const handleFocusResume = () => {
        dispatch('FOCUS');
        setChatVisible(true);
        resetInactivity();
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setError(null);
        setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);
        dispatch('SEND');
        resetInactivity();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Unknown error');
            setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    const glowOpacity =
        isActive ? 0.55
            : botState === 'inactive' ? 0.05
                : 0.2;

    /* ─────────────────────────────────────────────────────────── */
    return (
        <>
            {/* ── Robot — mobile fixed or tracking ── */}
            {!hideBotOnMobile && (
                <motion.div
                    ref={robotRef}
                    animate={robotControls}
                    initial={{ x: mobile ? 0 : 'calc(28vw)', y: mobile ? 'calc(-100dvh + 280px)' : 'calc(-50vh - 160px)', opacity: 0, scale: 0.7 }}
                    style={{
                        position: 'fixed',
                        bottom: mobile ? 144 : 108,
                        left: '50%',
                        marginLeft: -22,
                        zIndex: (!mobile && !hasCursor) ? 1 : 51,
                        cursor: (botState === 'idle' || botState === 'arrival' || botState === 'cursor-follow' || botState === 'inactive') ? 'pointer' : 'default',
                    }}
                    onClick={(e) => {
                        if (botState === 'idle' || botState === 'arrival' || botState === 'cursor-follow' || botState === 'inactive') handleFocus();
                        e.stopPropagation();
                    }}
                >
                    <motion.div style={{ x: springX, y: springY, position: 'relative' }}>
                        <AnimatePresence>
                            {showHi && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                    style={{
                                        position: 'absolute',
                                        top: -36,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '4px 10px',
                                        borderRadius: '10px 10px 10px 2px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    Hi!
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <GlassRobot state={botState} />
                        {/* Glow ring */}
                        <motion.div
                            animate={{ opacity: glowOpacity }}
                            transition={{ duration: 0.6 }}
                            style={{
                                position: 'absolute', bottom: -8, left: '50%', marginLeft: -20,
                                width: 40, height: 12, background: 'var(--tint-primary)',
                                borderRadius: '50%', filter: 'blur(10px)', pointerEvents: 'none',
                                transition: 'background 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
            {/* ── Chat UI — full-width anchor, flex-center children ── */}
            {barVisible && (
                <motion.div
                    ref={chatRef}
                    style={{
                        position: 'fixed',
                        bottom: mobile ? 92 : 100, // Increased gap from dock
                        left: 0, right: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 50,
                        gap: 8,
                        pointerEvents: 'none',   /* pass-through unless on children */
                        opacity: containerOpacity,
                    }}
                >
                    {/* Messages panel */}
                    <AnimatePresence>
                        {chatVisible && messages.length > 0 && (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                transition={{ duration: 0.25 }}
                                style={{
                                    width: mobile ? 280 : 'min(340px, 62vw)',
                                    maxHeight: mobile ? 240 : 280,
                                    overflowY: 'auto',
                                    padding: '14px 14px 10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    borderRadius: 20,
                                    position: 'relative',
                                    pointerEvents: 'auto',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(16px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                {/* No close button here — moved below */}

                                {messages.map((msg, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            maxWidth: '84%', padding: '8px 13px',
                                            borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                                            background: msg.role === 'user' ? 'var(--tint-primary)' : 'rgba(255,255,255,0.09)',
                                            fontSize: 13, lineHeight: 1.55,
                                            color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.80)',
                                            transition: 'background 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                                        }}>
                                            {msg.role === 'assistant' ? renderMd(msg.text) : msg.text}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div style={{
                                            padding: '8px 13px', borderRadius: '14px 14px 14px 3px',
                                            background: 'rgba(255,255,255,0.09)',
                                            display: 'flex', gap: 5, alignItems: 'center',
                                        }}>
                                            {[0, 1, 2].map((i) => (
                                                <motion.div key={i}
                                                    animate={{ opacity: [0.25, 1, 0.25] }}
                                                    transition={{ duration: 0.9, delay: i * 0.22, repeat: Infinity }}
                                                    style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.65)' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <p style={{ fontSize: 12, color: 'rgba(255,120,120,0.85)', textAlign: 'center', margin: 0, padding: '0 24px 0 0' }}>
                                        {error}
                                    </p>
                                )}

                                <div ref={messagesEnd} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Close row — always visible above input pill */}
                    <AnimatePresence>
                        {chatVisible && messages.length > 0 && (
                            <motion.div
                                key="close-row"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    width: mobile ? 280 : 'min(340px, 72vw)',
                                    pointerEvents: 'auto',
                                }}
                            >
                                <button
                                    onClick={handleClose}
                                    aria-label="Close chat"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        borderRadius: 100, padding: '4px 10px 4px 8px',
                                        cursor: 'pointer', color: 'rgba(255,255,255,0.50)',
                                        fontSize: 11, fontFamily: 'inherit',
                                    }}
                                >
                                    <span style={{ fontSize: 9 }}>✕</span> close
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input pill */}
                    <motion.div
                        style={{
                            width: mobile ? 280 : 'min(340px, 72vw)',
                            borderRadius: 100,
                            display: 'flex', alignItems: 'center',
                            padding: '11px 16px', gap: 8,
                            pointerEvents: 'auto',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: isActive
                                ? '0 0 0 1px var(--tint-border, rgba(255,255,255,0.15)), 0 8px 28px rgba(0,0,0,0.30)'
                                : '0 4px 16px rgba(0,0,0,0.20)',
                            transition: 'box-shadow 0.4s ease',
                        }}
                    >
                        <span style={{
                            fontSize: 14, color: 'var(--tint-primary)', flexShrink: 0,
                            transition: 'color 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                            lineHeight: 1, userSelect: 'none',
                        }}>
                            ✦
                        </span>

                        <input
                            value={input}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about my portfolio…"
                            aria-label="Portfolio chat input"
                            style={{
                                flex: 1, background: 'none', border: 'none', outline: 'none',
                                color: 'rgba(255,255,255,0.85)', fontSize: mobile ? 16 : 13,
                                fontFamily: 'inherit', minWidth: 0,
                            }}
                        />

                        <AnimatePresence>
                            {input.trim() && (
                                <motion.button
                                    key="send"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ duration: 0.18 }}
                                    onClick={handleSend}
                                    disabled={loading}
                                    aria-label="Send"
                                    style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'var(--tint-primary)', border: 'none',
                                        cursor: loading ? 'default' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: 14, flexShrink: 0,
                                        opacity: loading ? 0.6 : 1,
                                        transition: 'background 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                                    }}
                                >
                                    ↑
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
