'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  splitBy?: 'word' | 'character';
  staggerDelay?: number;
}

/**
 * TextReveal - Animated text reveal effect
 * Reveals text word by word or character by character as it enters viewport
 * Optimized with smoother easing and configurable stagger
 */
export function TextReveal({
  children,
  className = '',
  delay = 0,
  splitBy = 'word',
  staggerDelay = 0.025,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const items = splitBy === 'word' ? children.split(' ') : children.split('');
  const separator = splitBy === 'word' ? ' ' : '';

  return (
    <span ref={ref} className={className}>
      {items.map((item, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: delay + index * staggerDelay,
              ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier
            }}
          >
            {item}
            {separator}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

interface GradientTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

/**
 * GradientTextReveal - Text with animated gradient reveal
 * Uses smooth easing for elegant effect
 */
export function GradientTextReveal({
  children,
  className = '',
  delay = 0,
}: GradientTextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.span
      ref={ref}
      className={`inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      initial={{ opacity: 0, backgroundPosition: '200% center' }}
      animate={
        isInView
          ? { opacity: 1, backgroundPosition: '0% center' }
          : { opacity: 0, backgroundPosition: '200% center' }
      }
      transition={{
        opacity: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
        backgroundPosition: { duration: 1.2, delay: delay + 0.2, ease: [0.25, 0.1, 0.25, 1] },
      }}
    >
      {children}
    </motion.span>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

/**
 * CountUp - Animated counter that counts up when in view
 * Optimized with smoother easing curve for natural counting feel
 */
export function CountUp({
  end,
  duration = 1.8,
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {isInView && <MotionNumber from={0} to={end} duration={duration} delay={delay} />}
      </motion.span>
      {suffix}
    </span>
  );
}

function MotionNumber({ from, to, duration, delay }: { from: number; to: number; duration: number; delay: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  return (
    <motion.span
      ref={nodeRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        if (!nodeRef.current || hasStarted.current) return;
        hasStarted.current = true;

        const node = nodeRef.current;
        const startTime = Date.now() + delay * 1000;

        const animate = () => {
          const now = Date.now();
          if (now < startTime) {
            requestAnimationFrame(animate);
            return;
          }

          const elapsed = now - startTime;
          const progress = Math.min(elapsed / (duration * 1000), 1);
          // Smooth ease-out cubic for natural deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(from + (to - from) * eased);
          node.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }}
    >
      {from}
    </motion.span>
  );
}
