import { Variants } from "framer-motion"

/**
 * Check if user prefers reduced motion
 * Respects system-level accessibility preferences
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation duration based on user preference
 * Returns 0 if user prefers reduced motion, otherwise returns the provided duration
 */
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration
}

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion() ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.5),
      ease: "easeOut"
    }
  }
}

// Fade in with scale
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: prefersReducedMotion() ? 1 : 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.4),
      ease: "easeOut"
    }
  }
}

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getAnimationDuration(0.1),
      delayChildren: getAnimationDuration(0.1)
    }
  }
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: prefersReducedMotion() ? 0 : -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.5),
      ease: "easeOut"
    }
  }
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: prefersReducedMotion() ? 0 : 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.5),
      ease: "easeOut"
    }
  }
}

// Bounce in
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: prefersReducedMotion() ? 1 : 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: prefersReducedMotion()
      ? { duration: 0 }
      : {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
  }
}

// Rotate in
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: prefersReducedMotion() ? 0 : -10, scale: prefersReducedMotion() ? 1 : 0.95 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: "easeOut"
    }
  }
}

// Page transition
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: getAnimationDuration(0.3),
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: getAnimationDuration(0.2)
    }
  }
}

// Card hover effect
export const cardHover = {
  rest: { scale: 1 },
  hover: {
    scale: prefersReducedMotion() ? 1 : 1.02,
    transition: {
      duration: getAnimationDuration(0.2),
      ease: "easeInOut"
    }
  },
  tap: {
    scale: prefersReducedMotion() ? 1 : 0.98
  }
}

// Icon pulse
export const iconPulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: prefersReducedMotion() ? [1, 1, 1] : [1, 1.1, 1],
    transition: {
      duration: getAnimationDuration(2),
      repeat: prefersReducedMotion() ? 0 : Infinity,
      ease: "easeInOut"
    }
  }
}
