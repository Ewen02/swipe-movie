'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedGradientBackgroundProps {
  children?: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
}

/**
 * AnimatedGradientBackground - Smooth animated gradient background
 * Optimized for performance with GPU-accelerated transforms
 * Automatically reduces animations on mobile for better performance
 */
export function AnimatedGradientBackground({
  children,
  className = '',
  intensity = 'medium',
  speed = 'medium',
}: AnimatedGradientBackgroundProps) {
  const reduceMotion = useReducedMotion();

  // Intensity presets for opacity - reduced on mobile
  const opacityMap = {
    subtle: { primary: reduceMotion ? 0.1 : 0.15, secondary: reduceMotion ? 0.08 : 0.1 },
    medium: { primary: reduceMotion ? 0.12 : 0.2, secondary: reduceMotion ? 0.1 : 0.15 },
    strong: { primary: reduceMotion ? 0.18 : 0.3, secondary: reduceMotion ? 0.12 : 0.2 },
  };

  // Speed presets in seconds - slower on mobile for less CPU usage
  const speedMap = {
    slow: reduceMotion ? 20 : 12,
    medium: reduceMotion ? 15 : 8,
    fast: reduceMotion ? 10 : 5,
  };

  const opacity = opacityMap[intensity];
  const duration = speedMap[speed];

  // Reduced blur on mobile for better performance
  const blurAmount = reduceMotion ? '40px' : '60px';
  const smallBlur = reduceMotion ? '30px' : '50px';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Primary orb - top left */}
      <motion.div
        className="absolute -top-1/3 -left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / ${opacity.primary}) 0%, transparent 70%)`,
          filter: `blur(${blurAmount})`,
        }}
        animate={reduceMotion ? undefined : {
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      />

      {/* Secondary orb - bottom right - hidden on mobile for performance */}
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 w-[400px] h-[400px] md:block hidden rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, hsl(var(--accent) / ${opacity.primary}) 0%, transparent 70%)`,
          filter: `blur(${blurAmount})`,
        }}
        animate={reduceMotion ? undefined : {
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

      {/* Tertiary orb - center accent - hidden on mobile */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full will-change-transform hidden md:block"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / ${opacity.secondary}) 0%, transparent 70%)`,
          filter: `blur(${smallBlur})`,
        }}
        animate={reduceMotion ? undefined : {
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
 * Respects user's reduced motion preference
 */
export function GradientBorder({
  children,
  className = '',
  animated = true,
}: GradientBorderProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;

  return (
    <div className={`relative p-[2px] rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary will-change-transform"
        style={{ backgroundSize: '200% 100%' }}
        animate={
          shouldAnimate
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
 * Respects user's reduced motion preference
 */
export function ShimmerEffect({ children, className = '', delay = 2 }: ShimmerEffectProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {children}
      {!reduceMotion && (
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
      )}
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

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent' | 'green' | 'blue' | 'purple';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
}

/**
 * GlowCard - Card with animated gradient glow effect around it
 * Similar to Netwarm's pricing card effect
 * Respects user's reduced motion preference
 */
export function GlowCard({
  children,
  className = '',
  glowColor = 'primary',
  intensity = 'medium',
  animated = true,
}: GlowCardProps) {
  const reduceMotion = useReducedMotion();

  const colorMap = {
    primary: 'hsl(var(--primary))',
    accent: 'hsl(var(--accent))',
    green: 'rgb(34, 197, 94)',
    blue: 'rgb(59, 130, 246)',
    purple: 'rgb(168, 85, 247)',
  };

  const intensityMap = {
    subtle: { blur: '40px', opacity: 0.15 },
    medium: { blur: '60px', opacity: 0.25 },
    strong: { blur: '80px', opacity: 0.35 },
  };

  const color = colorMap[glowColor];
  const { blur, opacity } = intensityMap[intensity];
  const shouldAnimate = animated && !reduceMotion;

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-3xl will-change-transform"
        style={{
          background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
          filter: `blur(${blur})`,
          opacity,
        }}
        animate={
          shouldAnimate
            ? {
                scale: [1, 1.05, 1],
                opacity: [opacity, opacity * 1.2, opacity],
              }
            : undefined
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}

interface AnimatedBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
}

/**
 * AnimatedBorderCard - Card with animated gradient border
 * Respects user's reduced motion preference
 */
export function AnimatedBorderCard({
  children,
  className = '',
  borderWidth = 2,
}: AnimatedBorderCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative p-[${borderWidth}px] rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl will-change-transform"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
          backgroundSize: '200% 100%',
        }}
        animate={reduceMotion ? undefined : {
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-background rounded-[calc(1rem-2px)] h-full">
        {children}
      </div>
    </div>
  );
}
