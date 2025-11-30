'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGradientBackgroundProps {
  children?: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
}

/**
 * AnimatedGradientBackground - Smooth animated gradient background
 * Optimized for performance with GPU-accelerated transforms
 * Reduced opacity and blur for better mobile performance
 */
export function AnimatedGradientBackground({
  children,
  className = '',
  intensity = 'medium',
  speed = 'medium',
}: AnimatedGradientBackgroundProps) {
  // Intensity presets for opacity
  const opacityMap = {
    subtle: { primary: 0.15, secondary: 0.1 },
    medium: { primary: 0.2, secondary: 0.15 },
    strong: { primary: 0.3, secondary: 0.2 },
  };

  // Speed presets in seconds
  const speedMap = {
    slow: 12,
    medium: 8,
    fast: 5,
  };

  const opacity = opacityMap[intensity];
  const duration = speedMap[speed];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Primary orb - top left */}
      <motion.div
        className="absolute -top-1/3 -left-1/4 w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / ${opacity.primary}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1], // Custom easing for smoother motion
        }}
      />

      {/* Secondary orb - bottom right */}
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 w-[400px] h-[400px] rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, hsl(var(--accent) / ${opacity.primary}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: duration * 1.3,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
          delay: duration * 0.2,
        }}
      />

      {/* Tertiary orb - center accent */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / ${opacity.secondary}) 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 40, -40, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: duration * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: duration * 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
}

/**
 * GradientBorder - Animated gradient border effect
 */
export function GradientBorder({
  children,
  className = '',
  animated = true,
}: GradientBorderProps) {
  return (
    <div className={`relative p-[2px] rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary will-change-transform"
        style={{ backgroundSize: '200% 100%' }}
        animate={
          animated
            ? { backgroundPosition: ['0% center', '200% center', '0% center'] }
            : undefined
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-background rounded-[calc(1rem-2px)]">
        {children}
      </div>
    </div>
  );
}

interface ShimmerEffectProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * ShimmerEffect - Subtle shimmering highlight effect
 * Reduced intensity for a more elegant look
 */
export function ShimmerEffect({ children, className = '', delay = 2 }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: delay + 1,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * SpotlightCard - Card with mouse-following spotlight
 */
export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      whileHover="hover"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.1), transparent 50%)',
        }}
      />
      {children}
    </motion.div>
  );
}
