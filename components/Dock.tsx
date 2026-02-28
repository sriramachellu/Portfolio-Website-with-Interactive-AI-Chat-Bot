'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cpu, FolderOpen, Briefcase, Camera, ChefHat, Gamepad2 } from 'lucide-react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { useLightbox } from '@/lib/LightboxContext';
import { useIsMobile } from '@/lib/useIsMobile';

const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/skills', icon: Cpu, label: 'Skills' },
    { href: '/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/work', icon: Briefcase, label: 'Work' },
    { href: '/photography', icon: Camera, label: 'Photography' },
    { href: '/cooking', icon: ChefHat, label: 'Cooking' },
    { href: '/game', icon: Gamepad2, label: 'Game' },
];

/* Desktop sizes */
const BASE_DESKTOP = 40;
const MAX_DESKTOP = 64;
/* Mobile sizes */
const BASE_MOBILE = 32;
const MAX_MOBILE = 44;
const SPREAD = 120;

function getMagnification(mouseX: number, itemX: number, base: number, max: number): number {
    const dist = Math.abs(mouseX - itemX);
    if (dist > SPREAD) return base;
    const factor = 1 - dist / SPREAD;
    return base + (max - base) * factor * factor;
}

export default function Dock() {
    const pathname = usePathname();
    const { isLightboxOpen } = useLightbox();
    const isMobile = useIsMobile();
    const mobile = isMobile === true;
    const BASE = mobile ? BASE_MOBILE : BASE_DESKTOP;
    const MAX = mobile ? MAX_MOBILE : MAX_DESKTOP;
    const [mouseX, setMouseX] = useState<number | null>(null);
    const dockRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [sizes, setSizes] = useState<number[]>(NAV_ITEMS.map(() => BASE));

    useEffect(() => {
        if (mouseX === null) {
            setSizes(NAV_ITEMS.map(() => BASE));
            return;
        }
        const newSizes = itemRefs.current.map((el) => {
            if (!el) return BASE;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            return getMagnification(mouseX, cx, BASE, MAX);
        });
        setSizes(newSizes);
    }, [mouseX, BASE, MAX]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                translateX: '-50%',
                zIndex: 100,
                padding: '0 20px',
                pointerEvents: isLightboxOpen ? "none" : "auto",
            }}
            animate={{ opacity: isLightboxOpen ? 0 : 1, y: isLightboxOpen ? 20 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                ref={dockRef}
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: mobile ? 6 : 10,
                    padding: mobile ? '8px 10px' : '10px 16px',
                    borderRadius: mobile ? 22 : 28,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onMouseMove={(e) => setMouseX(e.clientX)}
                onMouseLeave={() => setMouseX(null)}
                onTouchMove={(e) => setMouseX(e.touches[0].clientX)}
                onTouchStart={(e) => setMouseX(e.touches[0].clientX)}
                onTouchEnd={() => setMouseX(null)}
                onTouchCancel={() => setMouseX(null)}
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
