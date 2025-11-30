'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
  delay?: number;
  rotateAmount?: number;
}

/**
 * FloatingElement - Creates a gentle floating animation
 * Perfect for icons, badges, and decorative elements
 * Optimized with smooth easing for natural motion
 */
export function FloatingElement({
  children,
  className = '',
  intensity = 'medium',
  speed = 'medium',
  delay = 0,
  rotateAmount = 0,
}: FloatingElementProps) {
  // Intensity presets for y offset
  const offsetMap = {
    subtle: 6,
    medium: 10,
    strong: 16,
  };

  // Speed presets in seconds
  const durationMap = {
    slow: 6,
    medium: 4,
    fast: 2.5,
  };

  const yOffset = offsetMap[intensity];
  const duration = durationMap[speed];

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      animate={{
        y: [-yOffset / 2, yOffset / 2, -yOffset / 2],
        rotate: rotateAmount ? [-rotateAmount, rotateAmount, -rotateAmount] : 0,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1], // Smooth sine-like easing
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

/**
 * ParallaxElement - Moves element based on scroll position
 * Uses CSS transform for smooth performance
 * Reduced movement for subtler effect
 */
export function ParallaxElement({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
}: ParallaxElementProps) {
  return (
    <motion.div
      className={`will-change-transform ${className}`}
      initial={{ y: 0 }}
      whileInView={{ y: direction === 'up' ? -30 * speed : 30 * speed }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * MagneticButton - Button with smooth hover/tap effect
 * Creates an interactive, playful effect with optimized spring physics
 */
export function MagneticButton({
  children,
  className = '',
}: MagneticButtonProps) {
  return (
    <motion.div
      className={`will-change-transform ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

/**
 * GlowEffect - Adds animated glow effect on hover
 * Uses CSS variables for theme-aware colors
 */
export function GlowEffect({
  children,
  className = '',
  intensity = 'medium',
}: GlowEffectProps) {
  const opacityMap = {
    subtle: 0.2,
    medium: 0.35,
    strong: 0.5,
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover="hover"
      initial="rest"
    >
      <motion.div
        className="absolute -inset-1 rounded-lg blur-lg will-change-transform"
        style={{
          background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
        }}
        variants={{
          rest: { opacity: 0, scale: 0.95 },
          hover: { opacity: opacityMap[intensity], scale: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
