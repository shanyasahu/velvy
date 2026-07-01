"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Lock, X } from "lucide-react";

import type { BookingDay, DayAvailabilityStatus } from "../booking.types";
import {
  getDayAvailabilityStatus,
  isDaySelectable,
} from "./lib/scheduleApi";
import { ScheduleDropdownPanel } from "./ScheduleDropdownPanel";

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

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

interface ServiceDatePickerProps {
  expertId: string;
  serviceId: string;
  days: BookingDay[];
  activeDayId: string;
  dayLabel: string;
  onSelect: (dayId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatusDot({ status }: { status: DayAvailabilityStatus }) {
  if (status === "available") {
    return <span className="h-1 w-1 rounded-full bg-(--success)" aria-hidden />;
  }
  if (status === "limited") {
    return <span className="h-1 w-1 rounded-full bg-orange-400" aria-hidden />;
  }
  return null;
}

export function ServiceDatePicker({
  expertId,
  serviceId,
  days,
  activeDayId,
  dayLabel,
  onSelect,
  open,
  onOpenChange,
}: ServiceDatePickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const availableByIso = useMemo(() => {
    const map = new Map<string, BookingDay>();
    days.forEach((day) => map.set(day.iso, day));
    return map;
  }, [days]);

  const firstAvailable = days[0];
  const lastAvailable = days[days.length - 1];

  const initial = parseIso(
    days.find((d) => d.id === activeDayId)?.iso ?? firstAvailable?.iso ?? "",
  );
  const [view, setView] = useState({ year: initial.year, month: initial.month });

  useEffect(() => {
    const active = days.find((d) => d.id === activeDayId);
    if (!active) return;
    const parsed = parseIso(active.iso);
    setView({ year: parsed.year, month: parsed.month });
  }, [activeDayId, days]);

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

  const cells = useMemo(() => {
    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const result: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) result.push(d);
    return result;
  }, [view]);

  const todayIso = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const handleSelectDay = (dayId: string) => {
    onSelect(dayId);
    onOpenChange(false);
  };

  return (
    <div className="min-w-0">
      <p className="mb-1 text-[10px] font-semibold text-(--text-secondary) lg:text-xs">
        Select Date
      </p>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-1.5 rounded-lg border border-(--border) bg-(--bg-card) px-2 py-1.5 text-left transition-colors hover:border-(--accent-primary) lg:gap-2 lg:px-2.5 lg:py-2"
      >
        <Calendar
          size={12}
          strokeWidth={1.8}
          className="shrink-0 text-(--accent-primary) lg:h-3.5 lg:w-3.5"
        />
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-(--text-primary) lg:text-xs">
          {dayLabel || "Pick a date"}
        </span>
        <ChevronDown
          size={11}
          strokeWidth={2}
          className={`shrink-0 text-(--text-muted) transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <ScheduleDropdownPanel
        open={open}
        onClose={() => onOpenChange(false)}
        anchorRef={triggerRef}
        minWidth={280}
      >
        <div>
          <div className="px-2 py-1.5 lg:px-2.5 lg:py-2">
            <div className="flex items-center justify-between gap-0.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Previous month"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40 lg:h-7 lg:w-7"
            >
              <ChevronLeft size={12} strokeWidth={2} />
            </button>
            <span className="truncate text-[10px] font-semibold text-(--text-primary) lg:text-xs">
              {MONTH_NAMES[view.month].slice(0, 3)} {view.year}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label="Next month"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40 lg:h-7 lg:w-7"
            >
              <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-1.5">
            <div className="grid grid-cols-7 gap-px">
              {WEEKDAY_HEADERS.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className="flex h-4 items-center justify-center text-[8px] font-semibold text-(--text-muted) lg:h-5 lg:text-[10px]"
                >
                  {label}
                </span>
              ))}

              {cells.map((day, index) => {
                if (day === null) return <span key={`blank-${index}`} />;

                const iso = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const match = availableByIso.get(iso);
                const isPast = iso < todayIso;
                const status =
                  match && !isPast
                    ? getDayAvailabilityStatus(expertId, serviceId, iso)
                    : isPast
                      ? "closed"
                      : "closed";
                const selectable = Boolean(match) && !isPast && isDaySelectable(status);
                const active = match?.id === activeDayId;

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!selectable}
                    onClick={() => {
                      if (!match || !selectable) return;
                      handleSelectDay(match.id);
                    }}
                    className={`mx-auto flex h-7 w-full flex-col items-center justify-center gap-px rounded-md text-[9px] transition-colors lg:h-9 lg:rounded-lg lg:text-xs ${
                      active
                        ? "primary-button font-semibold text-white"
                        : selectable
                          ? "text-(--text-primary) hover:bg-(--bg-secondary)"
                          : "cursor-not-allowed text-(--text-muted)/50"
                    }`}
                  >
                    {status === "full" ? (
                      <Lock size={9} strokeWidth={1.8} className="text-(--text-muted)" />
                    ) : status === "closed" && match && !isPast ? (
                      <X size={9} strokeWidth={2} className="text-(--danger)" />
                    ) : (
                      <>
                        <span>{day}</span>
                        {match && !isPast && <StatusDot status={status} />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          </div>

          <div className="border-t border-(--border) px-2 py-1.5 lg:px-2.5 lg:py-2">
            <div className="flex items-center justify-center gap-x-2 text-[7px] leading-none whitespace-nowrap text-(--text-muted) sm:gap-x-3 sm:text-[8px] lg:text-[10px]">
            <span className="flex shrink-0 items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-(--success)" />
              Available
            </span>
            <span className="flex shrink-0 items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Few slots
            </span>
            <span className="flex shrink-0 items-center gap-0.5">
              <Lock size={9} strokeWidth={1.8} />
              Full
            </span>
            <span className="flex shrink-0 items-center gap-0.5">
              <X size={9} strokeWidth={2} className="text-(--danger)" />
              Closed
            </span>
            </div>
          </div>
        </div>
      </ScheduleDropdownPanel>
    </div>
  );
}
