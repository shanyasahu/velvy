"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useClickOutside } from "../../experts/components/lib/useClickOutside";
import type { BookingDay } from "../booking.types";

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DatePickerPopoverProps {
  /** Available days (today onwards). Past dates are not present, so disabled. */
  days: BookingDay[];
  activeDayId: string;
  onSelect: (dayId: string) => void;
  onClose: () => void;
}

/** Parses "YYYY-MM-DD" into year/month/day numbers (month is 0-indexed). */
function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function DatePickerPopover({
  days,
  activeDayId,
  onSelect,
  onClose,
}: DatePickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose, true);

  // iso → BookingDay lookup for fast availability checks.
  const availableByIso = useMemo(() => {
    const map = new Map<string, BookingDay>();
    days.forEach((day) => map.set(day.iso, day));
    return map;
  }, [days]);

  const firstAvailable = days[0];
  const lastAvailable = days[days.length - 1];

  // Start on the month of the active (or first available) day.
  const initial = parseIso(
    days.find((d) => d.id === activeDayId)?.iso ?? firstAvailable?.iso ?? "",
  );
  const [view, setView] = useState({ year: initial.year, month: initial.month });

  const firstBound = firstAvailable ? parseIso(firstAvailable.iso) : null;
  const lastBound = lastAvailable ? parseIso(lastAvailable.iso) : null;

  const canPrev =
    firstBound !== null &&
    (view.year > firstBound.year ||
      (view.year === firstBound.year && view.month > firstBound.month));
  const canNext =
    lastBound !== null &&
    (view.year < lastBound.year ||
      (view.year === lastBound.year && view.month < lastBound.month));

  const goPrev = () => {
    if (!canPrev) return;
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  };
  const goNext = () => {
    if (!canNext) return;
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  };

  // Leading blanks + day cells for the visible month.
  const cells = useMemo(() => {
    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const result: (number | null)[] = Array.from(
      { length: firstWeekday },
      () => null,
    );
    for (let d = 1; d <= daysInMonth; d += 1) result.push(d);
    return result;
  }, [view]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Choose a date"
      className="absolute right-0 top-full z-50 mt-2 w-[min(15rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-2 shadow-[var(--shadow-card)] max-lg:fixed max-lg:inset-x-4 max-lg:top-auto max-lg:bottom-[10.5rem] max-lg:right-auto max-lg:mx-auto max-lg:max-w-[15rem] sm:p-3 lg:w-[min(16rem,calc(100vw-2.5rem))] lg:max-w-none"
    >
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
        <span className="truncate text-xs font-semibold text-(--text-primary) sm:text-sm">
          {MONTH_NAMES[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2 max-h-[min(10.5rem,calc(100dvh-14rem))] overflow-y-auto overscroll-contain scrollbar-none sm:mt-3 lg:max-h-none lg:overflow-visible">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {WEEKDAY_HEADERS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="flex h-5 items-center justify-center text-[9px] font-semibold text-(--text-muted) sm:h-6 sm:text-[10px]"
            >
              {label}
            </span>
          ))}

          {cells.map((day, index) => {
            if (day === null) return <span key={`blank-${index}`} />;

            const iso = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const match = availableByIso.get(iso);
            const disabled = !match;
            const active = match?.id === activeDayId;

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!match) return;
                  onSelect(match.id);
                  onClose();
                }}
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors sm:h-8 sm:w-8 sm:text-xs ${
                  active
                    ? "primary-button font-semibold text-white"
                    : disabled
                      ? "cursor-not-allowed text-(--text-muted)/40"
                      : "text-(--text-primary) hover:bg-(--bg-secondary)"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
