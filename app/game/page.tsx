'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTint } from '@/lib/TintContext';

const CANVAS_W = 480;
const CANVAS_H = 520;
const PAD_W = 80;
const PAD_H = 10;
const PAD_Y = CANVAS_H - 40;
const BALL_R = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_H = 24;
const BRICK_GAP = 6;
const BRICK_TOP = 60;
const SPEED_INIT = 4.5;

function buildBricks() {
    const bricks = [];
    const brickW = (CANVAS_W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
            bricks.push({
                x: BRICK_GAP + c * (brickW + BRICK_GAP),
                y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
                w: brickW,
                h: BRICK_H,
                alive: true,
                alpha: 1,
            });
        }
    }
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

export default function GamePage() {
    const { activeTint, setTint } = useTint();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef({
        padX: CANVAS_W / 2 - PAD_W / 2,
        ball: { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: SPEED_INIT * 0.6, vy: -SPEED_INIT },
        bricks: buildBricks(),
        score: 0,
        running: false,
        started: false,
        gameOver: false,
        won: false,
        ripples: [] as { x: number; y: number; r: number; alpha: number }[],
        tintColor: TINT_COLORS[activeTint] || '#2563EB',
    });
    const [display, setDisplay] = useState({ score: 0, gameOver: false, won: false, started: false });
    const rafRef = useRef<number>(0);
    const keysRef = useRef<Set<string>>(new Set());

    // Sync tint color
    useEffect(() => {
        gameRef.current.tintColor = TINT_COLORS[activeTint] || '#2563EB';
    }, [activeTint]);

    useEffect(() => { setTint('deep-blue'); }, [setTint]);

    const reset = useCallback(() => {
        const g = gameRef.current;
        g.padX = CANVAS_W / 2 - PAD_W / 2;
        g.ball = { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: SPEED_INIT * 0.6, vy: -SPEED_INIT };
        g.bricks = buildBricks();
        g.score = 0;
        g.running = false;
        g.started = false;
        g.gameOver = false;
        g.won = false;
        g.ripples = [];
        setDisplay({ score: 0, gameOver: false, won: false, started: false });
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const g = gameRef.current;
        const tc = g.tintColor;

        // Clear
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        // Background
        ctx.fillStyle = 'rgba(11,11,15,0)';
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        // Ripples
        g.ripples = g.ripples.filter((rp) => rp.alpha > 0.02);
        g.ripples.forEach((rp) => {
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            ctx.strokeStyle = `${tc}${Math.round(rp.alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 2;
            ctx.stroke();
            rp.r += 2.5;
            rp.alpha -= 0.04;
        });

        // Bricks
        const brickW = (CANVAS_W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
        g.bricks.forEach((b) => {
            if (!b.alive && b.alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = b.alpha;
            // Glass brick
            ctx.beginPath();
            ctx.roundRect(b.x, b.y, b.w, b.h, 6);
            ctx.fillStyle = `${tc}22`;
            ctx.fill();
            ctx.strokeStyle = `${tc}66`;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Glint
            const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
            grad.addColorStop(0, 'rgba(255,255,255,0.15)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
            if (!b.alive) b.alpha -= 0.08;
        });

        // Paddle
        ctx.beginPath();
        ctx.roundRect(g.padX, PAD_Y, PAD_W, PAD_H, 6);
        const padGrad = ctx.createLinearGradient(g.padX, PAD_Y, g.padX + PAD_W, PAD_Y);
        padGrad.addColorStop(0, `${tc}cc`);
        padGrad.addColorStop(1, `${tc}88`);
        ctx.fillStyle = padGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ball
        ctx.beginPath();
        ctx.arc(g.ball.x, g.ball.y, BALL_R, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(
            g.ball.x - 2, g.ball.y - 2, 1,
            g.ball.x, g.ball.y, BALL_R
        );
        ballGrad.addColorStop(0, '#fff');
        ballGrad.addColorStop(1, tc);
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.shadowColor = tc;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
    }, []);

    const gameLoop = useCallback(() => {
        const g = gameRef.current;
        if (!g.running) { draw(); rafRef.current = requestAnimationFrame(gameLoop); return; }

        const spd = 5;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) g.padX = Math.max(0, g.padX - spd);
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) g.padX = Math.min(CANVAS_W - PAD_W, g.padX + spd);

        // Move ball
        g.ball.x += g.ball.vx;
        g.ball.y += g.ball.vy;

        // Wall bounces
        if (g.ball.x - BALL_R < 0) { g.ball.x = BALL_R; g.ball.vx *= -1; }
        if (g.ball.x + BALL_R > CANVAS_W) { g.ball.x = CANVAS_W - BALL_R; g.ball.vx *= -1; }
        if (g.ball.y - BALL_R < 0) { g.ball.y = BALL_R; g.ball.vy *= -1; }

        // Paddle collision
        if (
            g.ball.y + BALL_R >= PAD_Y &&
            g.ball.y + BALL_R <= PAD_Y + PAD_H + 4 &&
            g.ball.x >= g.padX &&
            g.ball.x <= g.padX + PAD_W
        ) {
            g.ball.y = PAD_Y - BALL_R;
            // Angle based on hit position
            const rel = (g.ball.x - g.padX) / PAD_W - 0.5; // -0.5 to 0.5
            const spd = Math.sqrt(g.ball.vx ** 2 + g.ball.vy ** 2);
            g.ball.vx = rel * spd * 2;
            g.ball.vy = -Math.abs(g.ball.vy);
        }

        // Bottom = game over
        if (g.ball.y - BALL_R > CANVAS_H) {
            g.running = false;
            g.gameOver = true;
            setDisplay((d) => ({ ...d, gameOver: true }));
        }

        // Brick collisions
        const brickW = (CANVAS_W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
        let alive = 0;
        g.bricks.forEach((b) => {
            if (!b.alive) { if (b.alpha > 0) { } return; }
            alive++;
            if (
                g.ball.x + BALL_R > b.x &&
                g.ball.x - BALL_R < b.x + b.w &&
                g.ball.y + BALL_R > b.y &&
                g.ball.y - BALL_R < b.y + b.h
            ) {
                b.alive = false;
                g.score++;
                setDisplay((d) => ({ ...d, score: g.score }));
                g.ripples.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, r: 8, alpha: 0.85 });
                // Bounce
                const overlapLeft = g.ball.x + BALL_R - b.x;
                const overlapRight = b.x + b.w - (g.ball.x - BALL_R);
                const overlapTop = g.ball.y + BALL_R - b.y;
                const overlapBot = b.y + b.h - (g.ball.y - BALL_R);
                const minH = Math.min(overlapLeft, overlapRight);
                const minV = Math.min(overlapTop, overlapBot);
                if (minH < minV) g.ball.vx *= -1;
                else g.ball.vy *= -1;
            }
        });

        if (alive === 0) {
            g.running = false;
            g.won = true;
            setDisplay((d) => ({ ...d, won: true }));
        }

        draw();
        rafRef.current = requestAnimationFrame(gameLoop);
    }, [draw]);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(gameLoop);
        const onKey = (e: KeyboardEvent) => { keysRef.current.add(e.key); if (e.key === ' ') { e.preventDefault(); if (!gameRef.current.started) { gameRef.current.running = true; gameRef.current.started = true; setDisplay((d) => ({ ...d, started: true })); } } };
        const offKey = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };
        window.addEventListener('keydown', onKey);
        window.addEventListener('keyup', offKey);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('keyup', offKey);
        };
    }, [gameLoop]);

    // Mouse / touch control
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
        gameRef.current.padX = Math.min(CANVAS_W - PAD_W, Math.max(0, x - PAD_W / 2));
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * CANVAS_W;
        gameRef.current.padX = Math.min(CANVAS_W - PAD_W, Math.max(0, x - PAD_W / 2));
        if (!gameRef.current.started) {
            gameRef.current.running = true;
            gameRef.current.started = true;
            setDisplay((d) => ({ ...d, started: true }));
        }
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 160px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 32 }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Easter Egg
                </p>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Glass Breaker</h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
                    {display.started ? 'Use mouse or ← → keys to move the paddle.' : 'Press Space or click to start.'}
                </p>
            </motion.div>

            {/* Score bar */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-1"
                style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'center',
                    padding: '10px 28px',
                    marginBottom: 16,
                    borderRadius: 100,
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)',
                }}
            >
                <span>Score</span>
                <span style={{ color: 'var(--tint-primary)', fontSize: 22, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
                    {display.score}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13 }}>/ {BRICK_ROWS * BRICK_COLS}</span>
            </motion.div>

            {/* Canvas container */}
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
                    }}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    onClick={() => {
                        if (!gameRef.current.started) {
                            gameRef.current.running = true;
                            gameRef.current.started = true;
                            setDisplay((d) => ({ ...d, started: true }));
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
                                className="glass-1-tinted"
                                style={{ padding: '36px 48px', textAlign: 'center', borderRadius: 24 }}
                            >
                                <p style={{ fontSize: 42, marginBottom: 8 }}>{display.won ? '🎉' : '💔'}</p>
                                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                                    {display.won ? 'You Win!' : 'Game Over'}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>
                                    Score: {display.score} / {BRICK_ROWS * BRICK_COLS}
                                </p>
                                <button
                                    onClick={reset}
                                    style={{
                                        padding: '12px 28px',
                                        borderRadius: 100,
                                        background: 'var(--tint-primary)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: 15,
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Play Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="text-micro" style={{ color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>
                Mouse / touch to move · Space to launch
            </p>
        </div>
    );
}
