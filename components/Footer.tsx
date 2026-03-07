'use client';

import portfolioData from '@/lib/portfolio.json';
import { useIsMobile } from '@/lib/useIsMobile';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const isMobile = useIsMobile();
    const mobile = isMobile === true;

    return (
        <footer style={{
            padding: mobile ? '24px 24px 140px 24px' : '24px 24px 200px 24px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 400 }}>
                    &copy; {currentYear} {portfolioData.personal.name}. All rights reserved.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                    <span>Built with Next.js, Framer Motion, and Tailwind CSS</span>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--tint-primary)', opacity: 0.5 }} />
                    <span>Designed for the Future</span>
                </div>
            </div>
        </footer>
    );
}
