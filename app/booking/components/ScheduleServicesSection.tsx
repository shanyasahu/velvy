"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import type { BookingDay, ServiceScheduleSelection } from "../booking.types";
import type { ServiceItem } from "../../experts/experts.types";
import { buildAddServicesHref } from "./lib/bookingUrl";
import { getAvailableTimeSlots } from "./lib/scheduleApi";
import { ServiceScheduleCard } from "./ServiceScheduleCard";

function buildInitialSchedule(
  expertId: string,
  service: ServiceItem,
  days: BookingDay[],
  index: number,
  defaultTime: string,
): ServiceScheduleSelection {
  const day = days[Math.min(index, days.length - 1)] ?? days[0];
  if (!day) return { dayId: "", time: "" };

  const slots = getAvailableTimeSlots(expertId, service.id, day.iso);
  const time = slots.includes(defaultTime)
    ? defaultTime
    : (slots[0] ?? "");

  return { dayId: day.id, time };
}

interface ScheduleServicesSectionProps {
  expertId: string;
  services: ServiceItem[];
  currency: string;
  days: BookingDay[];
  defaultTime: string;
  schedules: Record<string, ServiceScheduleSelection>;
  onSchedulesChange: (schedules: Record<string, ServiceScheduleSelection>) => void;
  onRemoveService: (serviceId: string) => void;
}

export function ScheduleServicesSection({
  expertId,
  services,
  currency,
  days,
  defaultTime,
  schedules,
  onSchedulesChange,
  onRemoveService,
}: ScheduleServicesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    services[0]?.id ?? null,
  );

  useEffect(() => {
    if (expandedId && !services.some((s) => s.id === expandedId)) {
      setExpandedId(services[0]?.id ?? null);
      return;
    }
    if (!expandedId && services[0]) {
      setExpandedId(services[0].id);
    }
  }, [expandedId, services]);

  const handleRemove = useCallback(
    (serviceId: string) => {
      onRemoveService(serviceId);
    },
    [onRemoveService],
  );

  const updateSchedule = useCallback(
    (serviceId: string, schedule: ServiceScheduleSelection) => {
      onSchedulesChange({ ...schedules, [serviceId]: schedule });
    },
    [onSchedulesChange, schedules],
  );

  const clearSchedule = useCallback(
    (serviceId: string, index: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;
      const fresh = buildInitialSchedule(
        expertId,
        service,
        days,
        index,
        defaultTime,
      );
      updateSchedule(serviceId, { dayId: fresh.dayId, time: "" });
    },
    [days, defaultTime, expertId, services, updateSchedule],
  );

  const allScheduled = useMemo(
    () =>
      services.every((s) => {
        const sch = schedules[s.id];
        return sch?.dayId && sch?.time;
      }),
    [schedules, services],
  );

  return (
    <section className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] lg:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Calendar
            size={18}
            strokeWidth={1.8}
            className="shrink-0 text-(--accent-primary)"
          />
          <h2 className="font-[family-name:var(--font-heading)] text-base font-bold text-(--text-primary) lg:text-lg">
            Schedule Your Services
          </h2>
        </div>

        <Link
          href={buildAddServicesHref(
            expertId,
            services.map((s) => s.id),
          )}
          className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary) lg:text-xs"
        >
          <Plus size={12} strokeWidth={2} />
          Add More
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {services.map((service, index) => {
          const schedule =
            schedules[service.id] ??
            buildInitialSchedule(expertId, service, days, index, defaultTime);

          return (
            <ServiceScheduleCard
              key={service.id}
              index={index}
              expertId={expertId}
              service={service}
              currency={currency}
              days={days}
              schedule={schedule}
              expanded={expandedId === service.id}
              onToggleExpand={() =>
                setExpandedId((id) => (id === service.id ? null : service.id))
              }
              onScheduleChange={(next) => updateSchedule(service.id, next)}
              onClear={() => clearSchedule(service.id, index)}
              onRemove={() => handleRemove(service.id)}
            />
          );
        })}
      </div>

      {services.length > 0 && !allScheduled && (
        <p className="mt-2 text-center text-[10px] text-(--text-muted)">
          Pick a date and time for each service to continue.
        </p>
      )}
    </section>
  );
}

export { buildInitialSchedule };
