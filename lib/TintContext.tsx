'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Tint = 'deep-blue' | 'sage' | 'lavender' | 'amber' | 'teal' | 'rose' | 'clear';

interface TintContextType {
  activeTint: Tint;
  setTint: (tint: Tint) => void;
}

const TintContext = createContext<TintContextType>({
  activeTint: 'amber',
  setTint: () => { },
});

export function TintProvider({ children }: { children: React.ReactNode }) {
  const [activeTint, setActiveTint] = useState<Tint>('amber'); // Default for SSR

  useEffect(() => {
    // Client-side initialization: 75% chance for amber, 25% for others
    let initialTint: Tint = 'amber';
    if (Math.random() > 0.75) {
      const others: Tint[] = ['deep-blue', 'sage', 'lavender', 'teal', 'rose', 'clear'];
      initialTint = others[Math.floor(Math.random() * others.length)];
    }
    setActiveTint(initialTint);
  }, []);

  const setTint = useCallback((tint: Tint) => {
    setActiveTint(tint);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-tint', tint);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-tint', activeTint);
  }, [activeTint]);

  return (
    <TintContext.Provider value={{ activeTint, setTint }}>
      {children}
    </TintContext.Provider>
  );
}

export function useTint() {
  return useContext(TintContext);
}
