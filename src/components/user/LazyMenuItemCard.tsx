'use client';

import { useEffect, useRef, useState } from 'react';
import { MenuItemCard } from './MenuItemCard';
import type { MenuItem } from '@/lib/types';

interface LazyMenuItemCardProps {
  item: MenuItem;
  index: number;
}

export function LazyMenuItemCard({ item, index }: LazyMenuItemCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cardRef} className="min-h-[400px]">
      {isVisible ? (
        <MenuItemCard item={item} />
      ) : (
        <div className="w-full h-full bg-muted/50 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

