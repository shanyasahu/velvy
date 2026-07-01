"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

import { getTimePeriod, filterTimesByPeriod } from "./lib/scheduleUtils";
import { ScheduleDropdownPanel } from "./ScheduleDropdownPanel";

interface ServiceTimePickerProps {
  times: string[];
  activeTime: string;
  onSelect: (time: string) => void;
  dateLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceTimePicker({
  times,
  activeTime,
  onSelect,
  dateLabel,
  open,
  onOpenChange,
}: ServiceTimePickerProps) {
  const [period, setPeriod] = useState<"AM" | "PM">(() =>
    activeTime ? getTimePeriod(activeTime) : "AM",
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (activeTime) {
      setPeriod(getTimePeriod(activeTime));
    }
  }, [activeTime]);

  useEffect(() => {
    if (!open || !activeTime) return;
    const activeSlot = slotRefs.current[activeTime];
    activeSlot?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open, activeTime, period]);

  const shortDay = dateLabel.split(",")[0] ?? dateLabel;

  const amTimes = useMemo(() => filterTimesByPeriod(times, "AM"), [times]);
  const pmTimes = useMemo(() => filterTimesByPeriod(times, "PM"), [times]);
  const filteredTimes = period === "AM" ? amTimes : pmTimes;

  const handleSelect = useCallback(
    (time: string) => {
      onSelect(time);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  const handleToggleOpen = () => {
    const next = !open;
    if (next) {
      const preferred = activeTime ? getTimePeriod(activeTime) : "AM";
      const preferredTimes = filterTimesByPeriod(times, preferred);
      if (preferredTimes.length > 0) {
        setPeriod(preferred);
      } else {
        const fallback = preferred === "AM" ? "PM" : "AM";
        if (filterTimesByPeriod(times, fallback).length > 0) {
          setPeriod(fallback);
        }
      }
    }
    onOpenChange(next);
  };

  if (times.length === 0) {
    return (
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-semibold text-(--text-secondary) lg:text-xs">
          Select Time
        </p>
        <div className="flex min-h-[2.75rem] flex-col items-center justify-center rounded-lg border border-dashed border-(--border) bg-(--bg-secondary)/50 px-2 py-3 text-center lg:min-h-[3rem]">
          <p className="text-[10px] font-medium text-(--text-secondary) lg:text-xs">
            No available slots
          </p>
          <p className="mt-0.5 text-[9px] text-(--text-muted)">
            Try another date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <p className="mb-1 text-[10px] font-semibold text-(--text-secondary) lg:text-xs">
        Select Time
      </p>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-1.5 rounded-lg border border-(--border) bg-(--bg-card) px-2 py-1.5 text-left transition-colors hover:border-(--accent-primary) lg:gap-2 lg:px-2.5 lg:py-2"
      >
        <Clock
          size={12}
          strokeWidth={1.8}
          className="shrink-0 text-(--accent-primary) lg:h-3.5 lg:w-3.5"
        />
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-(--text-primary) lg:text-xs">
          {activeTime || "Pick a time"}
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
      >
        <div className="px-2 py-2 lg:px-2.5 lg:py-2.5">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:mb-2">
            <p className="text-[9px] font-medium text-(--text-muted) lg:text-[11px]">
              Available times on {shortDay}
            </p>
            <div
              className="flex rounded-lg border border-(--border) bg-(--bg-secondary)/40 p-0.5"
              role="tablist"
              aria-label="Time period"
            >
              {(["AM", "PM"] as const).map((value) => {
                const count = value === "AM" ? amTimes.length : pmTimes.length;
                const active = period === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    disabled={count === 0}
                    onClick={() => setPeriod(value)}
                    className={`rounded-md px-2 py-0.5 text-[9px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 lg:px-2.5 lg:py-1 lg:text-[10px] ${
                      active
                        ? "primary-button text-white"
                        : "text-(--text-secondary) hover:text-(--accent-primary)"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={scrollRef}
            role="listbox"
            aria-label={`${period} time slots`}
            className="flex max-h-44 flex-col gap-1 overflow-y-auto overscroll-contain lg:max-h-none lg:flex-row lg:gap-2 lg:overflow-x-auto lg:overflow-y-hidden lg:scroll-smooth lg:scrollbar-none"
          >
            {filteredTimes.length === 0 ? (
              <p className="w-full py-3 text-center text-[10px] text-(--text-muted) lg:text-xs">
                No {period} slots on {shortDay}.
              </p>
            ) : (
              filteredTimes.map((time) => {
                const active = time === activeTime;
                return (
                  <button
                    key={time}
                    ref={(node) => {
                      slotRefs.current[time] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => handleSelect(time)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-[11px] font-medium transition-colors lg:w-auto lg:shrink-0 lg:px-3.5 lg:py-2.5 lg:text-center lg:text-xs ${
                      active
                        ? "primary-button border-transparent text-white shadow-[var(--shadow-glow)]"
                        : "border-(--accent-primary) bg-(--bg-card) text-(--accent-primary) hover:bg-(--bg-secondary)"
                    }`}
                  >
                    {time}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-2.5 hidden items-center justify-center gap-x-3 border-t border-(--border) pt-2 text-[8px] text-(--text-muted) lg:flex lg:text-[9px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm border border-(--accent-primary) bg-(--bg-card)" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm primary-button" />
              Selected
            </span>
          </div>
        </div>
      </ScheduleDropdownPanel>
    </div>
  );
}
