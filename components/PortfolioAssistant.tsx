'use client';

import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import {
    motion, useAnimation, AnimatePresence,
    useScroll, useVelocity, useTransform, useSpring, useMotionValue,
} from 'framer-motion';

/* ─── Types ──────────────────────────────────────────────────── */
type BotState = 'intro' | 'idle' | 'active' | 'typing' | 'inactive';
type BotAction = 'RUN_DONE' | 'FOCUS' | 'BLUR' | 'TYPE' | 'INACTIVE' | 'SEND' | 'CLOSE';
type Message = { role: 'user' | 'assistant'; text: string };

function botReducer(state: BotState, action: BotAction): BotState {
    switch (action) {
        case 'RUN_DONE': return 'idle';
        case 'FOCUS': return 'active';
        case 'TYPE': return 'typing';
        case 'SEND': return 'active';
        case 'CLOSE': return 'idle';
        case 'BLUR': return state === 'active' || state === 'typing' ? 'idle' : state;
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
    const isIdle = state === 'idle';
    const isActive = state === 'active';

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
                            boxShadow: isActive || isTyping || isIdle
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
    const [botState, dispatch] = useReducer(botReducer, 'idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatVisible, setChatVisible] = useState(false);
    const [barVisible, setBarVisible] = useState(true);
    const [hasCursor, setHasCursor] = useState(false);

    const robotControls = useAnimation();
    const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEnd = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const robotRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springX = useSpring(cursorX, { stiffness: 120, damping: 20 });
    const springY = useSpring(cursorY, { stiffness: 120, damping: 20 });

    const isActive = botState === 'active' || botState === 'typing';

    useEffect(() => {
        // Safe check for window for initial value
        if (typeof window !== 'undefined' && mouseRef.current.x === 0) {
            mouseRef.current = { x: window.innerWidth * 0.47, y: window.innerHeight - 188 };
        }
        const handleMouseMove = (e: MouseEvent) => {
            if (!hasCursor) setHasCursor(true);
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (botState === 'idle' || botState === 'inactive') {
                const anchorX = window.innerWidth / 2 - 22;
                const anchorY = window.innerHeight - 108 - 44;
                cursorX.set(e.clientX - anchorX + 4);
                cursorY.set(e.clientY - anchorY + 4);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [botState, hasCursor, cursorX, cursorY]);

    useEffect(() => {
        if (botState === 'active' || botState === 'typing') {
            cursorX.set(0);
            cursorY.set(0);
        } else if (hasCursor) {
            const anchorX = typeof window !== 'undefined' ? window.innerWidth / 2 - 22 : 0;
            const anchorY = typeof window !== 'undefined' ? window.innerHeight - 108 - 44 : 0;
            cursorX.set(mouseRef.current.x - anchorX + 20);
            cursorY.set(mouseRef.current.y - anchorY + 20);
        }
    }, [botState, hasCursor, cursorX, cursorY]);

    /* ── Opacity ─────────────────────────────── */
    const containerOpacity = 1;

    /* ── Robot position constants ──────────────────────────────── */
    // Anchor: position:fixed, bottom:108px, left:50%, marginLeft:-22px
    // Home = right side near polaroid  (x = positive offset)
    // Dock = left of 440px chat bar    (x = -(220 + 10 + 22) = -252)
    const HOME_X = 'calc(47vw - 22px)';
    const HOME_Y = -80;
    const DOCK_X = -260;
    const DOCK_Y = 8;

    /* ── Intro sequence (Removed) ─────────────────────────────── */
    useEffect(() => {
        // Start immediately in idle
        dispatch('RUN_DONE');
    }, []);

    /* ── State → robot position ────────────────────────────────── */
    useEffect(() => {
        switch (botState) {
            case 'idle': {
                const anchorX = typeof window !== 'undefined' ? window.innerWidth / 2 - 22 : 0;
                const anchorY = typeof window !== 'undefined' ? window.innerHeight - 108 - 44 : 0;

                if (!hasCursor) {
                    // Peek behind the top edge of the hero polaroid
                    robotControls.start({
                        x: 'calc(28vw)', y: 'calc(-50vh - 160px)', scale: 0.7, opacity: 0.85,
                        transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as const },
                    });
                } else {
                    robotControls.start({
                        x: 0, y: 0,
                        scale: 0.88, opacity: 0.85,
                        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
                    });
                }
                break;
            }
            case 'active':
                robotControls.start({
                    x: DOCK_X, y: DOCK_Y, scale: 1.05, opacity: 1,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                });
                break;
            case 'typing':
                robotControls.start({
                    x: DOCK_X, y: DOCK_Y, scale: 1.05, opacity: 1,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botState, robotControls, hasCursor]);

    /* ── Inactivity timer ──────────────────────────────────────── */
    const resetInactivity = useCallback(() => {
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => {
            dispatch('INACTIVE');
            setChatVisible(false); // hide panel, but keep messages for resume
        }, 60_000);           // 60s — enough time to read a response
    }, []);

    useEffect(() => {
        if (botState !== 'intro') resetInactivity();
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
        if (!input.trim()) dispatch('BLUR');
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
            {/* ── Robot — separate fixed element ───────────────────── */}
            <motion.div
                ref={robotRef}
                animate={robotControls}
                initial={{ x: 'calc(28vw)', y: 'calc(-50vh - 160px)', opacity: 0, scale: 0.7 }}
                style={{
                    position: 'fixed',
                    bottom: 108,
                    left: '50%',
                    marginLeft: -22,
                    zIndex: hasCursor ? 51 : 1, // behind polaroid when no cursor
                    cursor: botState === 'idle' || botState === 'inactive' ? 'pointer' : 'default',
                }}
                onClick={() => {
                    if (botState === 'idle' || botState === 'inactive') handleFocus();
                }}
            >
                <motion.div style={{ x: springX, y: springY }}>
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

            {/* ── Chat UI — full-width anchor, flex-center children ── */}
            {barVisible && (
                <motion.div
                    ref={chatRef}
                    style={{
                        position: 'fixed',
                        bottom: 100,
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
                                className="glass-3 text-micro"
                                style={{
                                    width: 'min(460px, 90vw)',
                                    maxHeight: 280,
                                    overflowY: 'auto',
                                    padding: '14px 14px 10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    borderRadius: 20,
                                    position: 'relative',
                                    pointerEvents: 'auto',
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
                                    width: 'min(460px, 90vw)',
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
                        animate={{ width: isActive ? 'min(460px, 90vw)' : 'min(340px, 72vw)' }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{
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
                                color: 'rgba(255,255,255,0.85)', fontSize: 13,
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
