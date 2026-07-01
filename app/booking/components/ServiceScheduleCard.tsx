"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

import type { BookingDay, ServiceScheduleSelection } from "../booking.types";
import type { ServiceItem } from "../../experts/experts.types";
import { ServiceDatePicker } from "./ServiceDatePicker";
import { ServiceTimePicker } from "./ServiceTimePicker";
import { getAvailableTimeSlots } from "./lib/scheduleApi";
import {
  formatCollapsedSchedule,
  formatDayLabel,
  formatScheduleLabel,
} from "./lib/scheduleUtils";

interface ServiceScheduleCardProps {
  index: number;
  expertId: string;
  service: ServiceItem;
  currency: string;
  days: BookingDay[];
  schedule: ServiceScheduleSelection;
  expanded: boolean;
  onToggleExpand: () => void;
  onScheduleChange: (schedule: ServiceScheduleSelection) => void;
  onClear: () => void;
  onRemove: () => void;
}

export function ServiceScheduleCard({
  index,
  expertId,
  service,
  currency,
  days,
  schedule,
  expanded,
  onToggleExpand,
  onScheduleChange,
  onClear,
  onRemove,
}: ServiceScheduleCardProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const activeDay = days.find((d) => d.id === schedule.dayId) ?? days[0];

  const slotsForDay = (dayId: string) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return [];
    return getAvailableTimeSlots(expertId, service.id, day.iso);
  };

  const availableTimes = activeDay ? slotsForDay(activeDay.id) : [];

  const dayLabel = activeDay ? formatDayLabel(activeDay.iso) : "";
  const hasSelection = Boolean(activeDay && schedule.time);
  const collapsedLabel = formatCollapsedSchedule(activeDay, schedule.time);

  const selectDay = (dayId: string) => {
    const slots = slotsForDay(dayId);
    const time = slots.includes(schedule.time) ? schedule.time : (slots[0] ?? "");
    onScheduleChange({ dayId, time });
  };

  const selectTime = (time: string) => {
    onScheduleChange({ ...schedule, time });
  };

  const handleDateOpenChange = (open: boolean) => {
    setDatePickerOpen(open);
    if (open) setTimePickerOpen(false);
  };

  const handleTimeOpenChange = (open: boolean) => {
    setTimePickerOpen(open);
    if (open) setDatePickerOpen(false);
  };

  const handleToggleExpand = () => {
    setDatePickerOpen(false);
    setTimePickerOpen(false);
    onToggleExpand();
  };

  return (
    <article className="overflow-visible rounded-xl border border-(--border) bg-(--bg-card)">
      {/* Card header */}
      <div className="flex items-start gap-2 p-3 lg:items-center">
        <span className="primary-button flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>

        <button
          type="button"
          onClick={handleToggleExpand}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-xs font-semibold leading-snug text-(--text-primary)">
            {service.name}
          </p>
          <p className="mt-0.5 text-[10px] text-(--text-secondary)">
            {service.duration} ·{" "}
            <span className="font-semibold text-(--brand-gold)">
              {currency}
              {service.price}
            </span>
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          {!expanded && hasSelection && (
            <span className="hidden items-center gap-1 text-right text-[9px] font-medium leading-tight text-(--text-secondary) min-[400px]:flex lg:text-xs">
              <Calendar size={11} strokeWidth={1.8} className="shrink-0 text-(--brand-gold) lg:h-3.5 lg:w-3.5" />
              <span className="max-w-[9.5rem] line-clamp-2 lg:max-w-[11rem]">{collapsedLabel}</span>
            </span>
          )}

          <div className="flex items-center gap-0.5">
          {expanded && hasSelection && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-(--text-muted) transition-colors hover:text-(--danger)"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${service.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-secondary) hover:text-(--danger)"
          >
            <X size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={handleToggleExpand}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--bg-secondary)"
          >
            {expanded ? (
              <ChevronUp size={16} strokeWidth={2} />
            ) : (
              <ChevronDown size={16} strokeWidth={2} />
            )}
          </button>
          </div>
        </div>
      </div>

      {!expanded && hasSelection && (
        <div className="flex items-center justify-end gap-1.5 border-t border-(--border) px-3 py-2 min-[400px]:hidden">
          <Calendar size={12} strokeWidth={1.8} className="shrink-0 text-(--brand-gold)" />
          <span className="text-right text-[10px] font-medium text-(--text-secondary)">
            {collapsedLabel}
          </span>
        </div>
      )}

      {expanded && (
        <div className="border-t border-(--border) px-3 pb-3 pt-2.5">
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
            {/* Date */}
            <div className="min-w-0">
              <ServiceDatePicker
                expertId={expertId}
                serviceId={service.id}
                days={days}
                activeDayId={schedule.dayId}
                dayLabel={dayLabel}
                onSelect={selectDay}
                open={datePickerOpen}
                onOpenChange={handleDateOpenChange}
              />
            </div>

            {/* Time */}
            <div className="min-w-0">
              <ServiceTimePicker
                times={availableTimes}
                activeTime={schedule.time}
                onSelect={selectTime}
                dateLabel={dayLabel}
                open={timePickerOpen}
                onOpenChange={handleTimeOpenChange}
              />
            </div>

            {hasSelection && (
              <div className="flex items-start gap-2 rounded-lg border border-(--accent-primary)/10 bg-(--accent-primary)/5 px-2.5 py-2 lg:col-span-2">
                <Calendar
                  size={14}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-(--accent-primary)"
                />
                <p className="min-w-0 flex-1 text-[10px] leading-snug font-medium text-(--text-primary) lg:text-xs">
                  <span className="text-(--text-secondary)">Selected: </span>
                  {formatScheduleLabel(activeDay, schedule.time)}
                </p>
                <button
                  type="button"
                  onClick={onClear}
                  className="shrink-0 text-[10px] font-semibold text-(--accent-secondary) hover:text-(--accent-primary) lg:text-xs"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
