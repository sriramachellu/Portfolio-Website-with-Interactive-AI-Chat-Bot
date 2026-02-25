'use client';

import React, { createContext, useContext, useState } from 'react';

interface LightboxContextType {
    isLightboxOpen: boolean;
    setIsLightboxOpen: (isOpen: boolean) => void;
}

const LightboxContext = createContext<LightboxContextType>({
    isLightboxOpen: false,
    setIsLightboxOpen: () => { },
});

export function LightboxProvider({ children }: { children: React.ReactNode }) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <LightboxContext.Provider value={{ isLightboxOpen, setIsLightboxOpen }}>
            {children}
        </LightboxContext.Provider>
    );
}

export function useLightbox() {
    return useContext(LightboxContext);
}
