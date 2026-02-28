'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTint } from '@/lib/TintContext';
import { useIsMobile } from '@/lib/useIsMobile';

const CANVAS_W = 800;
const CANVAS_H = 580;
const PAD_W = 120;
const PAD_H = 14;
const PAD_Y = CANVAS_H - 40;
const BALL_R = 8;
const SPEED_INIT = 6.0;
const AI_FACTS = [
    "Transformers unlocked AI scale using parallel self-attention instead of recurrence.",
    "RLHF teaches large models to align with human intent, not just data patterns.",
    "Quantization shrinks billion-parameter models to run on everyday laptops.",
    "FlashAttention rewired GPU memory access to dramatically accelerate training.",
    "Latent Diffusion compresses reality into vectors, then rebuilds it as art.",
    "MLOps turns fragile experiments into resilient, production-grade AI systems.",
    "Vector databases power semantic memory for modern RAG-based assistants.",
    "Model pruning cuts neural deadweight without sacrificing intelligence.",
    "Direct Preference Optimization simplifies alignment without unstable reward loops.",
    "Hybrid recommenders solve cold-start problems using signals beyond behavior.",
    "Stochastic Gradient Descent quietly powers nearly every neural breakthrough.",
    "RAG grounds generation in real data, reducing hallucinations dramatically.",
    "Autoencoders learn compressed representations without explicit supervision.",
    "Batch Normalization stabilized deep networks and enabled extreme depth.",
    "Dropout fights overfitting by forcing networks to learn redundantly.",
    "ReLU accelerated deep learning by eliminating vanishing gradients.",
    "Backpropagation scales learning across millions of interconnected parameters.",
    "LoRA and QLoRA adapt giant models with surprisingly few trainable weights.",
    "CNNs detect spatial hierarchies from pixels to complex structures.",
    "RNNs model time dependencies across language, signals, and sequences.",
    "Monte Carlo Tree Search balances exploration and exploitation in decisions.",
    "AutoML automates modeling pipelines once reserved for expert engineers.",
    "Explainable AI bridges the gap between prediction and human trust.",
    "Federated Learning trains globally without centralizing private data."
];

interface Brick {
    x: number;
    y: number;
    w: number;
    h: number;
    alive: boolean;
    alpha: number;
    hits: number;
    shakeX: number;
    shakeTimer: number;
    scale: number;
}

interface Shard {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    size: number;
    alpha: number;
    color: string;
}

function buildBricks() {
    const bricks: Brick[] = [];
    const centerX = CANVAS_W / 2;
    const centerY = 145; // 1/4 of CANVAS_H (580)
    // Exactly 24 bricks diamond: 1, 3, 5, 6, 5, 3, 1
    const rowFlow = [1, 3, 5, 6, 5, 3, 1];
    const bw = 40;
    const bh = 22;
    const gap = 6;
    rowFlow.forEach((count, r) => {
        const rowY = centerY - (rowFlow.length * (bh + gap)) / 2 + r * (bh + gap);
        for (let c = 0; c < count; c++) {
            // Re-implement 3-hit to 1-hit difficulty
            const middleR = Math.floor(rowFlow.length / 2);
            const distFromCenter = Math.abs(r - middleR) + Math.abs(c - Math.floor(count / 2));
            const maxDist = 6; // Approx max units from center in this small diamond

            let hits = 1;
            if (distFromCenter >= 3) hits = 3;
            else if (distFromCenter >= 1) hits = 2;

            // Calibration: Precisely two 1-hit bricks in the center of the middle row
            if (r === middleR && (c === 2 || c === 3)) hits = 1;
            else if (r === middleR && hits === 1) hits = 2; // Ensure others in middle are at least 2

            bricks.push({
                x: centerX - (count * (bw + gap)) / 2 + c * (bw + gap),
                y: rowY,
                w: bw, h: bh,
                alive: true, alpha: 1, hits: hits,
                shakeX: 0, shakeTimer: 0, scale: 1
            });
        }
    });
    return bricks;
}

const TINT_COLORS: Record<string, string> = {
    'deep-blue': '#2563EB',
    'sage': '#5A8F6A',
    'lavender': '#8B6CBB',
    'amber': '#D97706',
    'teal': '#0D9488',
    'rose': '#BE185D',
    'clear': '#aaaaaa',
};

export function NeuralBreakerGame() {
    const isMobile = useIsMobile();
    const mobile = isMobile === true;
    const { activeTint, setTint } = useTint();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef({
        padX: CANVAS_W / 2 - PAD_W / 2,
        targetPadX: CANVAS_W / 2 - PAD_W / 2,
        padW: PAD_W,
        ballAttached: true,
        ball: { x: CANVAS_W / 2, y: PAD_Y - BALL_R, vx: SPEED_INIT * 0.6, vy: -SPEED_INIT },
        bricks: buildBricks(),
        lives: 3,
        score: 0,
        running: false,
        started: false,
        gameOver: false,
        won: false,
        shards: [] as Shard[],
        shuffledFacts: [] as string[],
        paddleGlow: 0,
    });
    const [display, setDisplay] = useState({
        score: 0,
        gameOver: false,
        won: false,
        started: false,
        lives: 3,
        facts: [] as string[]
    });
    const rafRef = useRef<number>(0);
    const keysRef = useRef<Set<string>>(new Set());
    const tintRef = useRef(activeTint);

    useEffect(() => { tintRef.current = activeTint; }, [activeTint]);
    useEffect(() => { setTint('deep-blue'); }, [setTint]);

    const reset = useCallback(() => {
        const g = gameRef.current;
        g.padX = CANVAS_W / 2 - PAD_W / 2;
        g.targetPadX = CANVAS_W / 2 - PAD_W / 2;
        g.padW = PAD_W;
        g.ballAttached = true;
        g.ball = { x: g.padX + g.padW / 2, y: PAD_Y - BALL_R, vx: SPEED_INIT * 0.6, vy: -SPEED_INIT };
        g.bricks = buildBricks();
        g.score = 0;
        g.lives = 3;
        g.running = false;
        g.started = false;
        g.gameOver = false;
        g.won = false;
        g.shards = [];
        g.paddleGlow = 0;

        // Shuffle Facts for unique variety
        const pool = [...AI_FACTS];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        g.shuffledFacts = pool.slice(0, 24);

        setDisplay({ score: 0, gameOver: false, won: false, started: false, lives: 3, facts: [] });
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const g = gameRef.current;
        const tc = TINT_COLORS[tintRef.current] || '#2563EB';

        // Background
        ctx.fillStyle = 'rgba(11,11,15,0)';
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        // Shards
        g.shards.forEach((s) => {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rot);
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = s.color || tc;
            ctx.beginPath();
            ctx.roundRect(-s.size / 2, -s.size / 2, s.size, s.size, 1);
            ctx.fill();
            ctx.restore();
        });

        // Bricks
        g.bricks.forEach((b) => {
            if (!b.alive && b.alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = b.alpha;

            // Apply Shake and Scale
            const bx = b.x + b.shakeX;
            const bw = b.w * b.scale;
            const bh = b.h * b.scale;
            const ox = (bw - b.w) / 2;
            const oy = (bh - b.h) / 2;

            // Glass brick
            ctx.beginPath();
            ctx.roundRect(bx - ox, b.y - oy, bw, bh, 4);

            // Color based on hits
            const alpha = b.hits === 3 ? 'cc' : b.hits === 2 ? '66' : '28';
            ctx.fillStyle = `${tc}${alpha}`;
            ctx.fill();

            // Hit & Wave Glow Pulse
            if (b.shakeTimer > 0) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = tc;
                ctx.strokeStyle = tc;
            } else if (!g.started) {
                // Horizontal Wave Glow (Left to Right)
                const waveSpeed = 0.003;
                const waveFreq = 0.008;
                const waveIntensity = (Math.sin(Date.now() * waveSpeed - b.x * waveFreq) + 1) * 6;
                ctx.shadowBlur = waveIntensity;
                ctx.shadowColor = tc;
                ctx.strokeStyle = `${tc}aa`;
            } else {
                ctx.strokeStyle = `${tc}aa`;
            }
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Glint
            if (b.hits > 1) {
                const grad = ctx.createLinearGradient(bx - ox, b.y - oy, bx - ox + bw, b.y - oy + bh);
                grad.addColorStop(0, 'rgba(255,255,255,0.2)');
                grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
                grad.addColorStop(1, 'rgba(255,255,255,0.1)');
                ctx.fillStyle = grad;
                ctx.fill();
            }
            ctx.restore();
            if (!b.alive) {
                b.alpha -= 0.08;
                b.scale += 0.01; // Fade out expansion
            }
        });

        // Paddle (Glass Themed)
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(g.padX, PAD_Y, g.padW, PAD_H, 6);

        // Dynamic Glow
        ctx.shadowBlur = 8 + g.paddleGlow * 12;
        ctx.shadowColor = tc;

        const padGrad = ctx.createLinearGradient(g.padX, PAD_Y, g.padX + g.padW, PAD_Y);
        padGrad.addColorStop(0, `${tc}44`);
        padGrad.addColorStop(0.5, `${tc}88`);
        padGrad.addColorStop(1, `${tc}44`);
        ctx.fillStyle = padGrad;
        ctx.fill();

        // Reflection/Glint
        const padGlint = ctx.createLinearGradient(g.padX, PAD_Y, g.padX, PAD_Y + PAD_H);
        padGlint.addColorStop(0, 'rgba(255,255,255,0.4)');
        padGlint.addColorStop(0.2, 'rgba(255,255,255,0.1)');
        padGlint.addColorStop(1, 'rgba(255,255,255,0.2)');
        ctx.fillStyle = padGlint;
        ctx.fill();

        ctx.strokeStyle = `${tc}cc`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Ball
        ctx.beginPath();
        const b = g.ball;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, BALL_R);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, '#fff');
        grad.addColorStop(1, tc);
        ctx.fillStyle = grad;
        ctx.shadowBlur = 8; // Slightly more presence
        ctx.shadowColor = tc;
        ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }, []); // Decoupled from activeTint

    const gameLoop = useCallback(() => {
        const g = gameRef.current;

        // Paddle move (Lerp for smoothness)
        const moveSpeed = 7;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) g.targetPadX = Math.max(0, g.targetPadX - moveSpeed * 1.5);
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) g.targetPadX = Math.min(CANVAS_W - g.padW, g.targetPadX + moveSpeed * 1.5);

        // Smooth Lerp
        const lerpFactor = 0.22; // 0 to 1
        g.padX += (g.targetPadX - g.padX) * lerpFactor;

        // Paddle Glow Decay
        if (g.paddleGlow > 0) g.paddleGlow -= 0.05;

        // Ball physics
        if (g.ballAttached) {
            g.ball.x = g.padX + g.padW / 2;
            // Realistic "jump" bounce: only moves upwards from paddle surface
            const bouncePhase = Date.now() / 250;
            const idleJump = Math.abs(Math.sin(bouncePhase)) * 24;
            g.ball.y = PAD_Y - BALL_R - (g.running ? 0 : idleJump);
        }

        // Update Shards
        for (let i = g.shards.length - 1; i >= 0; i--) {
            const s = g.shards[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.15; // Slightly stronger gravity
            s.rot += s.vrot;
            s.alpha -= 0.02;
            if (s.alpha <= 0) g.shards.splice(i, 1);
        }

        if (!g.running) {
            draw();
            rafRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        if (!g.ballAttached) {
            const speedScale = 1 + Math.floor(g.score / 20) * 0.1111; // Scales 6.0 -> 10.0 (+0.66 per 20pts)
            g.ball.x += g.ball.vx * speedScale;
            g.ball.y += g.ball.vy * speedScale;

            if (g.ball.x - BALL_R < 0) {
                g.ball.x = BALL_R; g.ball.vx *= -1;
            }
            if (g.ball.x + BALL_R > CANVAS_W) { g.ball.x = CANVAS_W - BALL_R; g.ball.vx *= -1; }
            if (g.ball.y - BALL_R < 0) { g.ball.y = BALL_R; g.ball.vy *= -1; }

            // Paddle collision
            if (g.ball.y + BALL_R >= PAD_Y && g.ball.y + BALL_R <= PAD_Y + PAD_H + 4 && g.ball.x >= g.padX && g.ball.x <= g.padX + g.padW) {
                g.ball.y = PAD_Y - BALL_R;
                const rel = (g.ball.x - g.padX) / g.padW - 0.5;
                const speed = Math.sqrt(g.ball.vx ** 2 + g.ball.vy ** 2);
                g.ball.vx = rel * speed * 2;
                g.ball.vy = -Math.abs(g.ball.vy);
                g.paddleGlow = 1.0; // Trigger glow
            }
        }

        // Death logic
        if (g.ball.y - BALL_R > CANVAS_H) {
            g.lives--;
            setDisplay(d => ({ ...d, lives: g.lives }));
            if (g.lives <= 0) {
                g.running = false;
                g.gameOver = true;
                setDisplay(d => ({ ...d, gameOver: true }));
            } else {
                g.ballAttached = true;
                g.padX = CANVAS_W / 2 - g.padW / 2;
                g.targetPadX = g.padX;
                g.ball = { x: g.padX + g.padW / 2, y: PAD_Y - BALL_R, vx: SPEED_INIT * 0.6, vy: -SPEED_INIT };
                g.running = false;
                g.started = false;
                setDisplay(d => ({ ...d, started: false }));
            }
        }

        // Bricks
        let alive = 0;
        const tc = TINT_COLORS[tintRef.current] || '#2563EB';
        g.bricks.forEach((b) => {
            // Update Shake
            if (b.shakeTimer > 0) {
                b.shakeTimer -= 16;
                b.shakeX = (Math.random() - 0.5) * (b.hits === 2 ? 4 : 6);
                if (b.shakeTimer <= 0) b.shakeX = 0;
            }

            if (!b.alive) return;
            alive++;
            if (g.ball.x + BALL_R > b.x && g.ball.x - BALL_R < b.x + b.w && g.ball.y + BALL_R > b.y && g.ball.y - BALL_R < b.y + b.h) {
                b.hits--;
                if (b.hits <= 0) {
                    b.alive = false;
                    b.scale = 1.06;
                    // Shatter Particles
                    const shardCount = 8;
                    for (let j = 0; j < shardCount; j++) {
                        g.shards.push({
                            x: b.x + b.w / 2,
                            y: b.y + b.h / 2,
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6 - 2,
                            rot: Math.random() * Math.PI * 2,
                            vrot: (Math.random() - 0.5) * 0.2,
                            size: 3 + Math.random() * 5,
                            alpha: 1,
                            color: tc
                        });
                    }

                    g.score += 5;
                    setDisplay(d => {
                        const nextFactIdx = d.facts.length;
                        if (nextFactIdx < 24) {
                            return { ...d, facts: [...d.facts, g.shuffledFacts[nextFactIdx]] };
                        }
                        return d;
                    });
                } else {
                    b.shakeTimer = 150;
                }
                setDisplay(d => ({ ...d, score: g.score }));

                // Collision bounce
                const dx = g.ball.x - (b.x + b.w / 2);
                const dy = g.ball.y - (b.y + b.h / 2);
                if (Math.abs(dx / b.w) > Math.abs(dy / b.h)) g.ball.vx *= -1;
                else g.ball.vy *= -1;
            }
        });

        if (alive === 0) {
            g.running = false;
            g.won = true;
            setDisplay(d => ({ ...d, won: true }));
        }

        draw();
        rafRef.current = requestAnimationFrame(gameLoop);
    }, [draw, reset]);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(gameLoop);
        const onKey = (e: KeyboardEvent) => {
            keysRef.current.add(e.key);
            if (e.key === ' ') {
                e.preventDefault();
                const g = gameRef.current;
                if (!g.started) {
                    g.running = true;
                    g.started = true;
                    setDisplay((d) => ({ ...d, started: true }));
                }
                if (g.ballAttached) {
                    g.ballAttached = false;
                }
            }
        };
        const offKey = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };
        window.addEventListener('keydown', onKey);
        window.addEventListener('keyup', offKey);
        reset();
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('keyup', offKey);
        };
    }, [gameLoop, reset]);

    // Mouse / touch control
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
        gameRef.current.targetPadX = Math.min(CANVAS_W - gameRef.current.padW, Math.max(0, x - gameRef.current.padW / 2));
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * CANVAS_W;
        gameRef.current.targetPadX = Math.min(CANVAS_W - gameRef.current.padW, Math.max(0, x - gameRef.current.padW / 2));
        if (!gameRef.current.started) {
            gameRef.current.running = true;
            gameRef.current.started = true;
            setDisplay((d) => ({ ...d, started: true }));
        }
    }, []);

    return (
        <div
            onMouseEnter={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('game-hover', { detail: true }))}
            onMouseLeave={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('game-hover', { detail: false }))}
            style={{
                minHeight: mobile ? '100dvh' : '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: mobile ? '0 12px 20px' : '0 24px 40px',
                overflow: 'hidden'
            }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    textAlign: 'center',
                    marginBottom: 20,
                    width: '100%',
                    paddingTop: mobile ? '10dvh' : 0 // Ensure it sits below the notch/tint switcher properly
                }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Neural Breaker
                </p>
                <h1 style={{
                    fontSize: mobile ? 'clamp(24px, 6vw, 28px)' : 'clamp(28px, 4vw, 36px)',
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: mobile ? 1.2 : 1.4,
                    marginBottom: 12
                }}>
                    Interactive <br style={{ display: mobile ? 'block' : 'none' }} />
                    <span className="text-glass-tint">Inference</span> Engine
                </h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.40)', maxWidth: 600, margin: '0 auto', fontSize: 13 }}>
                    {display.started ? 'Adjust parameters via mouse or ← → keys.' : 'Initialize Inference: Press Space or click to start.'}
                </p>
            </motion.div>

            {/* Score Bar */}
            <div style={{
                display: 'flex',
                gap: 24,
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 16,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.60)'
            }}>
                <div style={{ color: 'rgba(255,255,255,0.40)' }}>
                    Compute Score <span style={{ color: '#fff', marginLeft: 6 }}>{display.score}</span>
                </div>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.10)', alignSelf: 'center' }} />
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.40)', marginRight: 4 }}>System Integrity</span>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: i < display.lives ? 'var(--tint-primary)' : 'rgba(255,255,255,0.10)',
                            boxShadow: i < display.lives ? '0 0 8px var(--tint-primary)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 32, alignItems: 'center' }}>
                {/* Left Facts (2 Columns, 6 Rows) - Dynamic Fill */}
                {!mobile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ padding: '0 8px', height: 20, display: 'flex', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                ACTIVE MODEL INSIGHTS
                            </span>
                        </div>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(6, 1fr)',
                            gap: 12, width: 280, height: CANVAS_H - 32, opacity: 0.9
                        }}>
                            <AnimatePresence>
                                {display.facts.slice(0, 12).map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        style={{
                                            padding: '12px', borderRadius: 12, fontSize: 10, color: TINT_COLORS[activeTint],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                            minHeight: 60, position: 'relative', overflow: 'hidden',
                                            background: `${TINT_COLORS[activeTint]}15`,
                                            backdropFilter: 'blur(12px)',
                                            border: `1px solid ${TINT_COLORS[activeTint]}30`,
                                            boxShadow: `0 4px 12px ${TINT_COLORS[activeTint]}10`,
                                            fontWeight: 500
                                        }}
                                    >
                                        <motion.div
                                            initial={{ left: '-100%' }}
                                            animate={{ left: '100%' }}
                                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
                                            style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', transform: 'skewX(-25deg)' }}
                                        />
                                        {f}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <motion.canvas
                        ref={canvasRef}
                        width={CANVAS_W}
                        height={CANVAS_H}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass-1"
                        style={{
                            display: 'block',
                            cursor: 'none',
                            borderRadius: 24,
                            maxWidth: '100%',
                            touchAction: 'none'
                        }}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                        onClick={() => {
                            const g = gameRef.current;
                            if (!g.started) {
                                g.running = true;
                                g.started = true;
                                setDisplay((d) => ({ ...d, started: true }));
                            }
                            if (g.ballAttached) {
                                g.ballAttached = false;
                            }
                        }}
                    />

                    {/* Game Over / Win overlay */}
                    <AnimatePresence>
                        {(display.gameOver || display.won) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(18px)',
                                    background: 'rgba(11,11,15,0.65)',
                                    borderRadius: 24,
                                    gap: 16,
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    style={{
                                        padding: '40px 56px', textAlign: 'center', borderRadius: 32,
                                        background: 'rgba(255,255,255,0.01)',
                                        backdropFilter: 'blur(32px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 24px ${TINT_COLORS[activeTint]}20`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >

                                    <motion.p
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ fontSize: 48, marginBottom: 12, filter: display.won ? 'none' : 'hue-rotate(300deg) saturate(2)' }}
                                    >
                                        {display.won ? '💠' : '⚠️'}
                                    </motion.p>
                                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>
                                        {display.won ? 'INFERENCE COMPLETE' : 'SIGNAL LOSS DETECTED'}
                                    </h2>
                                    <p style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginBottom: 32, letterSpacing: '0.05em' }}>
                                        COMPUTE_UNITS: {display.score} // STATUS: {display.won ? 'VALIDATED' : 'INTERRUPTED'}
                                    </p>
                                    <button
                                        onClick={() => reset()}
                                        className="glass-1-tinted"
                                        style={{
                                            padding: '12px 36px',
                                            borderRadius: 100,
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            border: `1px solid ${TINT_COLORS[activeTint]}50`,
                                            cursor: 'pointer',
                                            background: `${TINT_COLORS[activeTint]}20`,
                                            boxShadow: `0 4px 12px ${TINT_COLORS[activeTint]}30`,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        REBOOT INTERFACE
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Facts (2 Columns, 6 Rows) - Dynamic Fill */}
                {!mobile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ padding: '0 8px', height: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Nodes Activated: {display.facts.length} / 24
                            </span>
                        </div>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(6, 1fr)',
                            gap: 10, width: 280, height: CANVAS_H - 30, opacity: 0.9
                        }}>
                            <AnimatePresence>
                                {display.facts.slice(12, 24).map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        style={{
                                            padding: '12px', borderRadius: 12, fontSize: 10, color: TINT_COLORS[activeTint],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                            minHeight: 60, position: 'relative', overflow: 'hidden',
                                            background: `${TINT_COLORS[activeTint]}15`,
                                            backdropFilter: 'blur(12px)',
                                            border: `1px solid ${TINT_COLORS[activeTint]}30`,
                                            boxShadow: `0 4px 12px ${TINT_COLORS[activeTint]}10`,
                                            fontWeight: 500
                                        }}
                                    >
                                        <motion.div
                                            initial={{ left: '-100%' }}
                                            animate={{ left: '100%' }}
                                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
                                            style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', transform: 'skewX(-25deg)' }}
                                        />
                                        {f}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-micro" style={{ color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
                Move: Cursor / Touch · Execute: Space / Touch
            </p>
        </div>
    );
}
