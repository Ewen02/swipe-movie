import type { CSSProperties, ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right';

const directionClass: Record<Direction, string> = {
  up: 'lp-reveal',
  left: 'lp-reveal-left',
  right: 'lp-reveal-right',
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  /** Seconds to stagger the entrance, matching the old framer `delay`. */
  delay?: number;
  as?: 'div' | 'span';
}

/**
 * Reveal — CSS-only entrance animation (replaces the framer-motion
 * `ScrollReveal`). Renders as a plain server component: the animation runs
 * once on mount via a CSS class and `animation-delay`, with no JS runtime and
 * no framer-motion in the client bundle. Respects `prefers-reduced-motion`
 * through the `.lp-reveal*` rules in globals.css.
 */
export function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const style: CSSProperties | undefined =
    delay > 0 ? { animationDelay: `${delay}s` } : undefined;

  return (
    <Tag className={`${directionClass[direction]} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
