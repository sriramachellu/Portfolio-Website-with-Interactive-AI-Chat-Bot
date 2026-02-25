'use client';

import { motion } from 'framer-motion';
import portfolioData from '@/lib/portfolio.json';
import { Timeline } from '@/components/Timeline';

const { workExperience } = portfolioData;

export default function WorkPage() {
    return (
        <div style={{ minHeight: '100vh', padding: '120px 24px 160px', maxWidth: 1280, margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 100, textAlign: 'center' }}
            >
                <p className="text-micro" style={{ color: 'var(--tint-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                    Career Journey
                </p>
                <h1 className="text-section" style={{ color: '#fff', marginBottom: 20 }}>
                    The <span className="text-glass-tint">Education</span> and <span className="text-glass-tint">Experiences</span><br />
                </h1>
                <p className="text-body" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 600, margin: '0 auto' }}>
                    A timeline of growth from academic exploration to building production ready AI systems and scalable applications.
                </p>
            </motion.div>

            {/* Advanced Timeline Component */}
            <Timeline items={workExperience} showBullets={true} />
        </div>
    );
}
