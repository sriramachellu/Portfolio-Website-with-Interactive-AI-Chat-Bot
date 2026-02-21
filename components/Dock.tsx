'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cpu, FolderOpen, Briefcase, Camera, ChefHat, Gamepad2 } from 'lucide-react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/skills', icon: Cpu, label: 'Skills' },
    { href: '/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/work', icon: Briefcase, label: 'Work' },
    { href: '/photography', icon: Camera, label: 'Photography' },
    { href: '/cooking', icon: ChefHat, label: 'Cooking' },
    { href: '/game', icon: Gamepad2, label: 'Game' },
];

const BASE = 44;
const MAX = 64;
const SPREAD = 120;

function getMagnification(mouseX: number, itemX: number): number {
    const dist = Math.abs(mouseX - itemX);
    if (dist > SPREAD) return BASE;
    const factor = 1 - dist / SPREAD;
    return BASE + (MAX - BASE) * factor * factor;
}

export default function Dock() {
    const pathname = usePathname();
    const [mouseX, setMouseX] = useState<number | null>(null);
    const dockRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [sizes, setSizes] = useState<number[]>(NAV_ITEMS.map(() => BASE));

    /* ── Opacity ─────────────────────────────── */
    const dockOpacity = 1;

    useEffect(() => {
        if (mouseX === null) {
            setSizes(NAV_ITEMS.map(() => BASE));
            return;
        }
        const newSizes = itemRefs.current.map((el) => {
            if (!el) return BASE;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            return getMagnification(mouseX, cx);
        });
        setSizes(newSizes);
    }, [mouseX]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                translateX: '-50%',
                zIndex: 100,
                padding: '0 20px',
                opacity: dockOpacity,
            }}
        >
            <motion.div
                ref={dockRef}
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 10,
                    padding: '10px 16px',
                    borderRadius: 28,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onMouseMove={(e) => setMouseX(e.clientX)}
                onMouseLeave={() => setMouseX(null)}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {NAV_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const sz = sizes[i];

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            title={item.label}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}
                        >
                            <motion.div
                                style={{
                                    width: sz,
                                    height: sz,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 14,
                                    background: isActive
                                        ? 'var(--tint-glass)'
                                        : 'rgba(255,255,255,0.07)',
                                    border: isActive
                                        ? '1px solid var(--tint-primary)'
                                        : '1px solid rgba(255,255,255,0.10)',
                                    color: isActive ? 'var(--tint-primary)' : 'rgba(255,255,255,0.65)',
                                    transition: 'background 300ms, border-color 300ms, color 300ms',
                                }}
                                animate={{ width: sz, height: sz }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <Icon size={sz * 0.44} />
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    layoutId="dock-dot"
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        background: 'var(--tint-primary)',
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
