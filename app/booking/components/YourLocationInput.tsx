"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpDown, MapPin } from "lucide-react";

import type { LocationSuggestion } from "../booking.types";
import { filterLocationsSync, searchLocations } from "./lib/locationApi";
import { ScheduleDropdownPanel } from "./ScheduleDropdownPanel";

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
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setHighlightIndex(-1);
  }, []);

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
    <div className={compact ? "px-4 py-2" : "px-4 py-3.5"}>
      <div
        ref={anchorRef}
        className="flex items-center gap-3"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--bg-secondary) text-(--accent-primary)">
          <MapPin size={16} strokeWidth={1.8} />
        </span>

        <label className="flex min-w-0 flex-1 cursor-text flex-col leading-tight">
          <span className="text-xs font-semibold text-(--text-primary)">
            Your Location
          </span>
          <div
            className="relative min-w-0"
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-label="Where are you?"
              value={value}
              onChange={(event) => {
                const next = event.target.value;
                onChange(next);
                setSuggestions(filterLocationsSync(next));
                setOpen(true);
              }}
              onFocus={() => {
                setFocused(true);
                setSuggestions(filterLocationsSync(value));
                setOpen(true);
              }}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder=""
              className="w-full bg-transparent text-[11px] caret-(--accent-primary) text-(--text-primary) focus:outline-none"
            />
            {!value && !focused && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-px text-[11px]"
              >
                <span className="h-[0.9em] w-px shrink-0 animate-pulse bg-(--accent-primary)" />
                <span className="text-(--text-muted)">Where are you?</span>
              </span>
            )}
          </div>
        </label>

        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap locations"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--accent-primary) transition-colors hover:border-(--accent-primary)"
        >
          <ArrowUpDown size={16} strokeWidth={1.8} />
        </button>
      </div>

      <ScheduleDropdownPanel
        open={open}
        onClose={closeDropdown}
        anchorRef={anchorRef}
        className="py-1"
      >
        <ul id={listboxId} role="listbox" className="max-h-52 overflow-y-auto overscroll-contain">
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
      </ScheduleDropdownPanel>
    </div>
  );
}
