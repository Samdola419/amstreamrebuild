import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import type { MediaItem } from '../types/media';

interface ShelfRowProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  loading?: boolean;
  onItemClick: (item: MediaItem) => void;
  onViewAll?: () => void;
  getProgressMeta?: (item: MediaItem) => { label?: string; pct?: number };
  onRemoveItem?: (item: MediaItem) => void;
}

export function ShelfRow({
  title,
  subtitle,
  items,
  loading,
  onItemClick,
  onViewAll,
  getProgressMeta,
  onRemoveItem,
}: ShelfRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.78), behavior: 'smooth' });
  };

  if (!loading && !items.length) return null;

  return (
    <section className="relative py-4 sm:py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-3.5 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white truncate">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              View all →
            </button>
          )}
          <div className="hidden md:flex items-center gap-1 ml-1">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => nudge(-1)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/8 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => nudge(1)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/8 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="shelf-scroll flex gap-3.5 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-10 pb-2"
      >
        {loading && !items.length
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="w-[152px] sm:w-[176px] lg:w-[188px] shrink-0 animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-white/6 border border-white/5" />
                <div className="h-3.5 w-3/4 bg-white/8 rounded mt-2.5" />
                <div className="h-3 w-1/2 bg-white/5 rounded mt-1.5" />
              </div>
            ))
          : items.map((item) => {
              const meta = getProgressMeta ? getProgressMeta(item) : {};
              return (
                <MediaCard
                  key={`${item._type}:${item.id}:${item.imdb || ''}`}
                  item={item}
                  onClick={onItemClick}
                  progressLabel={meta.label}
                  progressPct={meta.pct}
                  onRemove={onRemoveItem}
                />
              );
            })}
      </div>
    </section>
  );
}
