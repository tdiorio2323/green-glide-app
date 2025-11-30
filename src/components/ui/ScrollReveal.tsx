import React from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number; // delay in ms
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className, 
  threshold = 0.1,
  delay = 0 
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin: '50px',
  });

  return (
    <div
      ref={ref as any}
      className={cn(
        "reveal-hidden",
        isVisible && "reveal-visible",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
