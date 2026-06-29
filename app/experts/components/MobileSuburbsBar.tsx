"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface MobileSuburbsBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Opens the filters / categories panel. */
  onFilterClick?: () => void;
}

export function MobileSuburbsBar({
  value,
  onChange,
  onFilterClick,
}: MobileSuburbsBarProps) {
  return (
    <label className="search-glass flex h-11 w-full items-center gap-3 rounded-2xl border px-4 backdrop-blur-2xl transition-colors focus-within:border-(--accent-primary)">
      <Search
        size={16}
        strokeWidth={1.4}
        className="shrink-0 text-(--text-secondary)"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Suburbs search only"
        className="min-w-0 flex-1 bg-transparent text-xs text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
      />
      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Filters"
        className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
      >
        <SlidersHorizontal size={16} strokeWidth={1.6} />
      </button>
    </label>
  );
}
