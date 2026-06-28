"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onFilterClick?: () => void;
}

export function SearchBar({
    className = "",
    placeholder = "Search services, salons, spas...",
    value,
    onChange,
    onFilterClick,
}: SearchBarProps) {
    return (
        <div
            className={`
        search-glass
        flex h-11 w-full items-center gap-3
        rounded-2xl border
        px-4 backdrop-blur-2xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,transparent)]
        ${className}
      `}
        >
            <Search
                className="h-4 w-4 shrink-0 text-(--text-secondary)"
                strokeWidth={1.4}
            />

            <input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="
          flex-1 bg-transparent
          text-xs text-(--text-primary)
          placeholder:text-(--text-muted)
          focus:outline-none
        "
            />

            <button
                type="button"
                onClick={onFilterClick}
                className="
          text-(--text-primary)
          transition-transform duration-300
          hover:rotate-90
        "
            >
                <SlidersHorizontal
                    className="h-4 w-4"
                    strokeWidth={1.4}
                />
            </button>
        </div>
    );
}
