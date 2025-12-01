'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if reduced motion is preferred or if device is mobile
 * Returns true if animations should be reduced for performance
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Check if mobile device (simple heuristic)
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Reduce motion if user prefers it OR on mobile for better performance
    setShouldReduceMotion(mediaQuery.matches || isMobile);

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches || isMobile);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to detect if device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
