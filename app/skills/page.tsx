'use client';

import { motion } from 'framer-motion';
import { ALL_SKILLS } from '@/lib/skillsData';
import { SkillGroupCard } from '@/components/SkillGroupCard';

const card = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function SkillsPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '120px 40px 200px',
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <p
                    style={{
                        color: 'var(--tint-primary)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                        fontSize: 12,
                    }}
                >
                    The Stack
                </p>

                <h1
                    style={{
                        fontSize: 'clamp(36px, 5vw, 54px)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        marginBottom: 24,
                    }}
                >
                    The <span className="text-glass-tint">Languages</span>, <span className="text-glass-tint">Systems</span>, and <span className="text-glass-tint">Frameworks </span><br /> i use to design intelligent, scalable software.
                </h1>
                <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 24 }}></div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(15px, 2vw, 17px)',
                        color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.6,

                    }}
                >
                    Every system starts with fundamentals and evolves through architecture, experimentation, and scale. These are the tools that power that journey.
                </motion.p>
            </div>

            <style>{`
              .masonry-skills {
                column-count: 1;
                column-gap: 24px;
                width: 100%;*-sfda*-czxs
              }
              @media (min-width: 768px) {
                .masonry-skills { column-count: 2; }
              }
              @media (min-width: 1024px) {
                .masonry-skills { column-count: 3; }
              }
              .masonry-skills > div {
                break-inside: avoid;
                margin-bottom: 24px;
              }
            `}</style>

            {/* Masonry Layout matching screenshot */}
            <motion.div
                initial="hidden"
                animate="show"
                className="masonry-skills"
            >
                {ALL_SKILLS.map((group) => (
                    <SkillGroupCard
                        key={group.label}
                        category={group.label}
                        desc={group.desc}
                        items={group.items}
                        variants={card}
                    />
                ))}
            </motion.div>
        </div>
    );
}