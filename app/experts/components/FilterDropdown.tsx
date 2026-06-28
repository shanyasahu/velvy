"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import type { FilterOption } from "../experts.types";
import { useClickOutside } from "./lib/useClickOutside";

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  /** Optional leading icon shown in the trigger. */
  icon?: ReactNode;
  /** Prefix label rendered before the selected value (e.g. "Sort by:"). */
  prefix?: string;
  /** Fallback label when no option matches `value`. */
  placeholder?: string;
  align?: "left" | "right";
  /** When true, renders a search box to filter the options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export function FilterDropdown({
  options,
  value,
  onChange,
  icon,
  prefix,
  placeholder = "Select",
  align = "left",
  searchable = false,
  searchPlaceholder = "Search...",
  className = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useClickOutside(containerRef, () => setOpen(false), open);

  useEffect(() => {
    if (open && searchable) {
      searchInputRef.current?.focus();
    }
    if (!open) {
      setQuery("");
    }
  }, [open, searchable]);

  const selected = options.find((option) => option.id === value);

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const needle = query.trim().toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query, searchable]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex h-9 w-full items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-card) px-3 text-[11px] font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary) lg:h-10 lg:px-4 lg:text-xs"
      >
        {icon && <span className="shrink-0 text-(--text-secondary)">{icon}</span>}

        <span className="flex-1 truncate text-left">
          {prefix && <span className="text-(--text-muted)">{prefix} </span>}
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`shrink-0 text-(--text-secondary) transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-30 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-(--border) bg-(--bg-card) shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {searchable && (
            <div className="border-b border-(--border) p-2">
              <div className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-secondary) px-2.5 py-1.5">
                <Search
                  size={13}
                  strokeWidth={1.8}
                  className="shrink-0 text-(--text-muted)"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
                />
              </div>
            </div>
          )}

          <ul
            id={listId}
            role="listbox"
            className="max-h-60 overflow-y-auto py-1.5"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-xs text-(--text-muted)">
                No matches found
              </li>
            ) : (
              filteredOptions.map((option) => {
                const isActive = option.id === value;
                return (
                  <li key={option.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-(--bg-secondary) ${
                        isActive
                          ? "font-medium text-(--accent-primary)"
                          : "text-(--text-primary)"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isActive && (
                        <Check size={13} strokeWidth={2} className="shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
