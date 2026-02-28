'use client';

import { useIsMobile } from '@/lib/useIsMobile';
import { DesktopHomeLayout } from '@/components/DesktopHomeLayout';
import { MobileHomeLayout } from '@/components/MobileHomeLayout';

interface ResponsiveLayoutWrapperProps {
    heroSection: React.ReactNode; // Desktop hero (passed through)
    isMounted: boolean;
    randomPhotos: any[];
    randomRecipes: any[];
    selectedPhoto: any | null;
    setSelectedPhoto: (photo: any | null) => void;
}

export function ResponsiveLayoutWrapper({
    heroSection,
    isMounted,
    randomPhotos,
    randomRecipes,
    selectedPhoto,
    setSelectedPhoto,
}: ResponsiveLayoutWrapperProps) {
    const isMobile = useIsMobile();

    /* SSR / first render — show a minimal shell matching the background color
       to prevent flash. The hook resolves within one requestAnimationFrame. */
    if (isMobile === null) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: 'var(--tint-background, #0B0B0F)',
                }}
            />
        );
    }

    if (isMobile) {
        return (
            <MobileHomeLayout
                isMounted={isMounted}
                randomPhotos={randomPhotos}
                randomRecipes={randomRecipes}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={setSelectedPhoto}
            />
        );
    }

    return (
        <DesktopHomeLayout
            heroSection={heroSection}
            isMounted={isMounted}
            randomPhotos={randomPhotos}
            randomRecipes={randomRecipes}
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
        />
    );
}
