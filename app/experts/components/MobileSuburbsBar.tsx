"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal } from "lucide-react";

import { useClickOutside } from "./lib/useClickOutside";

const SUBURB_OPTIONS = [
  "Suburbs search only",
  "All Melbourne",
  "CBD",
  "Southbank",
  "Richmond",
  "St Kilda",
  "Carlton",
  "Fitzroy",
  "Brunswick",
];

interface MobileSuburbsBarProps {
  /** Opens the filters / categories panel. */
  onFilterClick?: () => void;
}

export function MobileSuburbsBar({ onFilterClick }: MobileSuburbsBarProps) {
  const [value, setValue] = useState(SUBURB_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div className="flex items-center gap-2">
      <div ref={containerRef} className="relative flex-1">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="search-glass flex h-11 w-full items-center gap-3 rounded-2xl border px-4 backdrop-blur-2xl transition-colors hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,transparent)]"
        >
          <Search
            size={16}
            strokeWidth={1.4}
            className="shrink-0 text-(--text-secondary)"
          />
          <span className="flex-1 truncate text-left text-xs text-(--text-primary)">
            {value}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.6}
            className={`shrink-0 text-(--text-secondary) transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-(--border) bg-(--bg-card) py-1.5 shadow-lg"
          >
            {SUBURB_OPTIONS.map((option) => {
              const isActive = option === value;
              return (
                <li key={option} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      setValue(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-(--bg-secondary) ${
                      isActive
                        ? "font-medium text-(--accent-primary)"
                        : "text-(--text-primary)"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isActive && (
                      <Check size={13} strokeWidth={2} className="shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Filters"
        className="search-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-2xl transition-colors hover:border-(--accent-primary)"
      >
        <SlidersHorizontal
          size={16}
          strokeWidth={1.6}
          className="text-(--text-primary)"
        />
      </button>
    </div>
  );
}
