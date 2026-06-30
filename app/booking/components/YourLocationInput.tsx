"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpDown, MapPin } from "lucide-react";

import { useClickOutside } from "../../experts/components/lib/useClickOutside";
import type { LocationSuggestion } from "../booking.types";
import { filterLocationsSync, searchLocations } from "./lib/locationApi";

interface YourLocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSwap: () => void;
  compact?: boolean;
}

export function YourLocationInput({
  value,
  onChange,
  onSwap,
  compact = false,
}: YourLocationInputProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setHighlightIndex(-1);
  }, []);

  useClickOutside(containerRef, closeDropdown, open);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      searchLocations(value).then((results) => {
        if (cancelled) return;
        setSuggestions(results);
        setHighlightIndex(results.length > 0 ? 0 : -1);
      });
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value, open]);

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    onChange(suggestion.label);
    closeDropdown();
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter" && highlightIndex >= 0) {
      event.preventDefault();
      const picked = suggestions[highlightIndex];
      if (picked) selectSuggestion(picked);
    } else if (event.key === "Escape") {
      closeDropdown();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-3 px-4 ${compact ? "py-2" : "py-3.5"}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--bg-secondary) text-(--accent-primary)">
        <MapPin size={16} strokeWidth={1.8} />
      </span>

      <label className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-xs font-semibold text-(--text-primary)">
          Your Location
        </span>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next);
            setSuggestions(filterLocationsSync(next));
            setOpen(true);
          }}
          onFocus={() => {
            setSuggestions(filterLocationsSync(value));
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Where are you?"
          className="w-full bg-transparent text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={onSwap}
        aria-label="Swap locations"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--accent-primary) transition-colors hover:border-(--accent-primary)"
      >
        <ArrowUpDown size={16} strokeWidth={1.8} />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-4 right-4 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-(--border) bg-(--bg-card) py-1 shadow-[var(--shadow-card)]"
        >
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="option" aria-selected={index === highlightIndex}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightIndex(index)}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[11px] transition-colors ${
                    index === highlightIndex
                      ? "bg-(--bg-secondary) text-(--accent-primary)"
                      : "text-(--text-primary) hover:bg-(--bg-secondary)"
                  }`}
                >
                  <MapPin
                    size={13}
                    strokeWidth={1.8}
                    className="shrink-0 text-(--brand-gold)"
                  />
                  <span className="truncate">{suggestion.label}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2.5 text-[11px] text-(--text-muted)">
              No locations found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
