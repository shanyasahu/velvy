"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Languages,
  LocateFixed,
  Lock,
  MapPin,
  Plus,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import type { ServiceItem } from "../experts/experts.types";
import type { BookingData, BookingExpert } from "./booking.types";
import { YourLocationInput } from "./components/YourLocationInput";
import { DatePickerPopover } from "./components/DatePickerPopover";
import { buildAddServicesHref } from "./components/lib/bookingUrl";

/** Parses "60 min" → 60. */
function durationToMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

/** Formats a total number of minutes as "3h 45m" / "45m". */
function formatTotalDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function BookingPageContent({ data }: { data: BookingData }) {
  const router = useRouter();
  const { expert, currency, suggestedServices, days, times } = data;

  const [services, setServices] = useState<ServiceItem[]>(data.selectedServices);
  const [activeDayId, setActiveDayId] = useState(data.defaultDayId);
  const [activeTime, setActiveTime] = useState(data.defaultTime);

  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];

  const totalPrice = useMemo(
    () => services.reduce((sum, s) => sum + s.price, 0),
    [services],
  );
  const totalMinutes = useMemo(
    () => services.reduce((sum, s) => sum + durationToMinutes(s.duration), 0),
    [services],
  );

  const removeService = (id: string) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  const addService = (service: ServiceItem) =>
    setServices((prev) =>
      prev.some((s) => s.id === service.id) ? prev : [...prev, service],
    );

  // If every service is removed, send the user back to pick services again.
  useEffect(() => {
    if (services.length === 0) {
      router.replace(`/experts/${expert.id}`);
    }
  }, [services.length, expert.id, router]);

  const scheduleLabel = `${activeDay?.date ?? ""}, ${activeTime}`;
  const canCheckout = services.length > 0;

  return (
    <main className="min-h-screen bg-(--bg-primary) pb-44 lg:pb-12">
      <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-4 lg:space-y-5 lg:px-6 lg:py-6">
        <Link
          href={`/experts/${expert.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-card) px-3 py-1.5 text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Back to Experts
        </Link>

        {/* ===== Mobile ===== */}
        <div className="space-y-4 lg:hidden">
          <MobileHero expert={expert} />
          <LocationCard expert={expert} variant="mobile" />
          <SelectedServicesCard
            expertId={expert.id}
            services={services}
            currency={currency}
            onRemove={removeService}
          />
          <DateTimeCard
            days={days}
            times={times}
            activeDayId={activeDayId}
            activeTime={activeTime}
            onSelectDay={setActiveDayId}
            onSelectTime={setActiveTime}
          />
          <MobileSummary
            count={services.length}
            totalDuration={formatTotalDuration(totalMinutes)}
            totalPrice={`${currency}${totalPrice}`}
          />
        </div>

        {/* ===== Desktop ===== */}
        <div className="hidden space-y-5 lg:block">
          <DesktopHeader expert={expert} />

          {/* Selected services — full width on top */}
          <SelectedServicesCard
            expertId={expert.id}
            services={services}
            currency={currency}
            onRemove={removeService}
          />

          {/* Left: date picker + time · Right: location */}
          <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <DateTimeCard
              days={days}
              times={times}
              activeDayId={activeDayId}
              activeTime={activeTime}
              onSelectDay={setActiveDayId}
              onSelectTime={setActiveTime}
            />
            <LocationCard expert={expert} variant="desktop" />
          </div>

          <SuggestedServices
            expertId={expert.id}
            services={suggestedServices}
            currency={currency}
            selectedIds={new Set(services.map((s) => s.id))}
            onAdd={addService}
          />

          <DesktopSummaryBar
            services={services}
            expertName={expert.name}
            currency={currency}
            scheduleLabel={scheduleLabel}
            totalPrice={totalPrice}
            totalDuration={formatTotalDuration(totalMinutes)}
            disabled={!canCheckout}
          />
        </div>
      </div>

      {/* ===== Mobile sticky checkout ===== */}
      <div className="fixed inset-x-0 bottom-[84px] z-30 border-t border-(--border) bg-(--bg-card)/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
            <Lock size={13} strokeWidth={1.8} className="text-(--brand-gold)" />
            You&apos;ll pay securely
          </span>
          <button
            type="button"
            disabled={!canCheckout}
            className="primary-button ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Book &amp; Pay {currency}
            {totalPrice}
            <ArrowRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function InfoCircles({ expert }: { expert: BookingExpert }) {
  const items = [
    { icon: Globe, label: "Nationality", value: expert.nationality },
    { icon: Languages, label: "Languages", value: expert.languages.join(", ") },
    { icon: Award, label: "Experience", value: expert.experienceSummary },
    { icon: Sparkles, label: "Specialization", value: expert.specialization },
    { icon: MapPin, label: "Location", value: `${expert.distance} from you` },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 rounded-[var(--radius-md)] bg-(--bg-secondary) p-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center">
          <span className="primary-button flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[var(--shadow-glow)]">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <span className="text-[11px] font-semibold text-(--accent-primary)">
            {label}
          </span>
          <span className="text-[10px] leading-tight text-(--text-secondary)">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function LocationRow({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--bg-secondary) text-(--accent-primary)">
        <MapPin size={16} strokeWidth={1.8} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-xs font-semibold text-(--text-primary)">
          {label}
        </span>
        <span className="truncate text-[11px] text-(--text-secondary)">
          {value}
        </span>
      </span>
      {action}
    </div>
  );
}

function LocationCard({
  expert,
  variant,
}: {
  expert: BookingExpert;
  variant: "mobile" | "desktop";
}) {
  const [expertLocation, setExpertLocation] = useState(expert.expertLocation);
  const [yourLocation, setYourLocation] = useState("");

  const swapLocations = () => {
    setExpertLocation(yourLocation);
    setYourLocation(expertLocation);
  };

  return (
    <section className="flex h-full flex-col rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <h2 className="px-4 pb-1 pt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-(--text-primary) lg:text-xl">
        Choose your location
      </h2>
      <div className="flex flex-1 flex-col justify-center">
        <LocationRow
          label="Expert Location"
          value={expertLocation}
          action={
            <button
              type="button"
              aria-label="View on map"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--accent-primary) transition-colors hover:border-(--accent-primary)"
            >
              {variant === "mobile" ? (
                <Eye size={16} strokeWidth={1.8} />
              ) : (
                <LocateFixed size={16} strokeWidth={1.8} />
              )}
            </button>
          }
        />
        <div className="mx-4 border-t border-(--border)" />
        <YourLocationInput
          value={yourLocation}
          onChange={setYourLocation}
          onSwap={swapLocations}
        />
      </div>
    </section>
  );
}

function SelectedServicesCard({
  expertId,
  services,
  currency,
  onRemove,
}: {
  expertId: string;
  services: ServiceItem[];
  currency: string;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] lg:p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-[family-name:var(--font-heading)] text-base font-bold text-(--text-primary) lg:text-lg">
          Selected Services
        </h2>
        <Link
          href={buildAddServicesHref(
            expertId,
            services.map((s) => s.id),
          )}
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary)"
        >
          <Plus size={13} strokeWidth={2} />
          Add More Services
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-(--border) px-4 py-4 text-center text-xs text-(--text-muted)">
          No services selected yet.
        </p>
      ) : (
        <div className="mt-2 grid grid-cols-3 gap-2 lg:grid-cols-6 lg:gap-2.5 xl:grid-cols-7">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)"
            >
              <div className="relative aspect-[5/3] w-full">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(min-width: 1280px) 140px, (min-width: 1024px) 160px, 33vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(service.id)}
                  aria-label={`Remove ${service.name}`}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--bg-card)/90 text-(--text-primary) shadow-sm backdrop-blur transition-colors hover:text-(--danger)"
                >
                  <X size={11} strokeWidth={2} />
                </button>
              </div>
              <div className="px-1.5 py-1.5">
                <p className="truncate text-[11px] font-semibold leading-tight text-(--text-primary)">
                  {service.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] leading-tight text-(--text-secondary)">
                  {service.duration} ·{" "}
                  <span className="font-semibold text-(--brand-gold)">
                    {currency}
                    {service.price}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RoundChevron({
  dir,
  onClick,
  label,
}: {
  dir: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)"
    >
      {dir === "left" ? (
        <ChevronLeft size={16} strokeWidth={2} />
      ) : (
        <ChevronRight size={16} strokeWidth={2} />
      )}
    </button>
  );
}

function DateTimeCard({
  days,
  times,
  activeDayId,
  activeTime,
  onSelectDay,
  onSelectTime,
  showCalendarTrigger = true,
}: {
  days: BookingData["days"];
  times: string[];
  activeDayId: string;
  activeTime: string;
  onSelectDay: (id: string) => void;
  onSelectTime: (time: string) => void;
  /** Hide the full-month calendar button (mobile layout). */
  showCalendarTrigger?: boolean;
}) {
  const daysRef = useRef<HTMLDivElement>(null);
  const timesRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const scrollDays = (dir: 1 | -1) =>
    daysRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  const scrollTimes = (dir: 1 | -1) =>
    timesRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  const dayPill = (active: boolean) =>
    `flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border px-4 text-xs font-medium transition-colors ${
      active
        ? "primary-button border-transparent text-white"
        : "border-(--border) bg-(--bg-card) text-(--text-primary) hover:border-(--accent-primary)"
    }`;

  const timePill = (active: boolean) =>
    `flex h-10 shrink-0 items-center justify-center rounded-xl border px-4 text-xs font-medium transition-colors ${
      active
        ? "primary-button border-transparent text-white"
        : "border-(--border) bg-(--bg-card) text-(--text-primary) hover:border-(--accent-primary)"
    }`;

  return (
    <section className="flex h-full flex-col rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-(--text-primary) lg:text-xl">
          <Calendar size={18} strokeWidth={1.8} className="text-(--accent-primary)" />
          Choose Date &amp; Time
        </h2>
      </div>

      {/* ----- Date ----- */}
      <div className="mt-4 overflow-visible">
        <p className="mb-2 text-xs font-semibold text-(--text-secondary)">
          Select Date
        </p>
        <div className="relative flex items-center gap-2 overflow-visible">
          <RoundChevron
            dir="left"
            label="Previous dates"
            onClick={() => scrollDays(-1)}
          />
          <div
            ref={daysRef}
            className="flex flex-1 gap-2 overflow-x-auto scrollbar-none"
          >
            {days.map((day) => {
              const active = day.id === activeDayId;
              return (
                <button
                  key={day.id}
                  type="button"
                  data-day-id={day.id}
                  onClick={() => onSelectDay(day.id)}
                  className={dayPill(active)}
                >
                  <span className="font-semibold">{day.weekday}</span>
                  <span>{day.date}</span>
                </button>
              );
            })}
          </div>
          <RoundChevron
            dir="right"
            label="Next dates"
            onClick={() => scrollDays(1)}
          />

          {showCalendarTrigger && (
            <>
              <button
                type="button"
                onClick={() => setShowCalendar((open) => !open)}
                aria-label="Open date picker"
                aria-expanded={showCalendar}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-(--border) px-3 text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
              >
                <Calendar size={15} strokeWidth={1.8} className="text-(--accent-primary)" />
                <span className="hidden sm:inline">Select date</span>
                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className={`text-(--text-secondary) transition-transform ${showCalendar ? "rotate-180" : ""}`}
                />
              </button>

              {showCalendar && (
                <DatePickerPopover
                  days={days}
                  activeDayId={activeDayId}
                  onSelect={onSelectDay}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="my-4 h-px w-full bg-(--border)" />

      {/* ----- Time ----- */}
      <div>
        <p className="mb-2 text-xs font-semibold text-(--text-secondary)">
          Select Time
        </p>
        <div className="flex items-center gap-2">
          <RoundChevron
            dir="left"
            label="Earlier times"
            onClick={() => scrollTimes(-1)}
          />
          <div
            ref={timesRef}
            className="flex flex-1 gap-2 overflow-x-auto scrollbar-none"
          >
            {times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={timePill(time === activeTime)}
              >
                {time}
              </button>
            ))}
          </div>
          <RoundChevron
            dir="right"
            label="More times"
            onClick={() => scrollTimes(1)}
          />
        </div>
      </div>
    </section>
  );
}

function SuggestedServices({
  expertId,
  services,
  currency,
  selectedIds,
  onAdd,
}: {
  expertId: string;
  services: ServiceItem[];
  currency: string;
  selectedIds: Set<string>;
  onAdd: (service: ServiceItem) => void;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-(--text-primary) lg:text-xl">
          Suggested Services
        </h3>
        <Link
          href={buildAddServicesHref(expertId, selectedIds)}
          className="flex items-center gap-1 text-xs font-medium text-(--accent-secondary) hover:text-(--accent-primary)"
        >
          View all
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none">
        {services.map((service) => {
          const added = selectedIds.has(service.id);
          return (
            <div
              key={service.id}
              className="flex w-[220px] shrink-0 items-center gap-2.5 rounded-xl border border-(--border) bg-(--bg-card) p-2"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-xs font-semibold text-(--text-primary)">
                  {service.name}
                </span>
                <span className="text-[11px] text-(--text-secondary)">
                  {service.duration} ·{" "}
                  <span className="font-semibold text-(--brand-gold)">
                    {currency}
                    {service.price}
                  </span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => onAdd(service)}
                disabled={added}
                aria-label={`Add ${service.name}`}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                  added
                    ? "primary-button text-white"
                    : "border border-(--border) text-(--accent-primary) hover:border-(--accent-primary)"
                }`}
              >
                <Plus size={14} strokeWidth={2.2} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop                                                             */
/* ------------------------------------------------------------------ */

function DesktopHeader({ expert }: { expert: BookingExpert }) {
  return (
    <section className="grid items-stretch gap-4 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
      <div className="flex gap-4">
        <span className="relative w-32 shrink-0 self-stretch overflow-hidden rounded-[var(--radius-md)] bg-(--bg-secondary)">
          <Image
            src={expert.image}
            alt={expert.name}
            fill
            sizes="128px"
            className="object-cover object-top"
            priority
          />
        </span>

        <div className="min-w-0 self-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-(--text-primary)">
              {expert.name}
            </h1>
            {expert.verified && (
              <BadgeCheck size={20} strokeWidth={1.8} className="text-(--accent-primary)" />
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-(--accent-secondary)">
            {expert.specialty}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-(--brand-gold) text-(--brand-gold)" />
              <span className="font-semibold text-(--text-primary)">
                {expert.rating.toFixed(1)}
              </span>
              ({expert.reviews})
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} strokeWidth={1.8} className="text-(--brand-gold)" />
              {expert.distance}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={14} strokeWidth={1.8} className="text-(--brand-gold)" />
              {expert.language}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
            {expert.about}
          </p>
        </div>
      </div>

      <InfoCircles expert={expert} />
    </section>
  );
}

function DesktopSummaryBar({
  services,
  expertName,
  currency,
  scheduleLabel,
  totalPrice,
  totalDuration,
  disabled,
}: {
  services: ServiceItem[];
  expertName: string;
  currency: string;
  scheduleLabel: string;
  totalPrice: number;
  totalDuration: string;
  disabled: boolean;
}) {
  const primary = services[0];
  const title =
    services.length === 1
      ? primary.name
      : `${services.length} Services`;

  return (
    <section className="flex flex-wrap items-center gap-4 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)]">
      {primary && (
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={primary.image}
            alt={primary.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-(--text-primary)">
          {title}
        </p>
        <p className="text-xs text-(--text-secondary)">with {expertName}</p>
      </div>

      <p className="text-2xl font-bold text-(--accent-primary)">
        {currency}
        {totalPrice}
      </p>

      <div className="flex flex-col gap-1 text-xs text-(--text-secondary)">
        <span className="flex items-center gap-1.5">
          <Clock size={14} strokeWidth={1.8} className="text-(--brand-gold)" />
          {totalDuration}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} strokeWidth={1.8} className="text-(--brand-gold)" />
          {scheduleLabel}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled}
        className="primary-button ml-auto flex h-11 items-center justify-center gap-2 rounded-xl px-8 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
        <ArrowRight size={16} strokeWidth={1.8} />
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */

function MobileHero({ expert }: { expert: BookingExpert }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <div className="relative h-28 w-full">
        <Image
          src={expert.coverImage}
          alt={expert.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {expert.availableToday && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-(--success) px-2.5 py-1 text-[10px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Available Today
          </span>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end gap-3">
          <span className="relative -mt-8 block h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-(--bg-card) bg-(--bg-secondary)">
            <Image
              src={expert.image}
              alt={expert.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-lg font-bold text-(--text-primary)">
                {expert.name}
              </h1>
              {expert.verified && (
                <BadgeCheck size={16} strokeWidth={1.8} className="shrink-0 text-(--accent-primary)" />
              )}
            </div>
            <p className="truncate text-xs font-medium text-(--accent-secondary)">
              {expert.specialty}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--text-secondary)">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-(--brand-gold) text-(--brand-gold)" />
            <span className="font-semibold text-(--text-primary)">
              {expert.rating.toFixed(1)}
            </span>
            ({expert.reviews})
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} strokeWidth={1.8} className="text-(--brand-gold)" />
            {expert.distance}
          </span>
          <span className="flex items-center gap-1">
            <Globe size={13} strokeWidth={1.8} className="text-(--brand-gold)" />
            {expert.language}
          </span>
        </div>
      </div>
    </section>
  );
}

function MobileSummary({
  count,
  totalDuration,
  totalPrice,
}: {
  count: number;
  totalDuration: string;
  totalPrice: string;
}) {
  return (
    <section className="grid grid-cols-3 gap-2 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-(--text-primary)">
          {count} {count === 1 ? "Service" : "Services"}
        </span>
        <button
          type="button"
          className="mt-0.5 flex items-center gap-0.5 text-[11px] font-medium text-(--accent-secondary)"
        >
          View Details
          <ChevronDown size={12} strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-(--text-muted)">Total Duration</span>
        <span className="mt-0.5 text-sm font-semibold text-(--text-primary)">
          {totalDuration}
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-(--text-muted)">Total Price</span>
        <span className="mt-0.5 text-sm font-bold text-(--accent-primary)">
          {totalPrice}
        </span>
      </div>
    </section>
  );
}
