"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import type { ServiceItem } from "../experts/experts.types";
import type { BookingData, BookingExpert, ServiceScheduleSelection } from "./booking.types";
import { YourLocationInput } from "./components/YourLocationInput";
import { buildAddServicesHref } from "./components/lib/bookingUrl";
import {
  ScheduleServicesSection,
  buildInitialSchedule,
} from "./components/ScheduleServicesSection";
import { formatScheduleLabel } from "./components/lib/scheduleUtils";

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
  const { expert, currency, suggestedServices, days, defaultTime } = data;

  const [services, setServices] = useState<ServiceItem[]>(data.selectedServices);
  const [schedules, setSchedules] = useState<
    Record<string, ServiceScheduleSelection>
  >(() => {
    const initial: Record<string, ServiceScheduleSelection> = {};
    data.selectedServices.forEach((service, index) => {
      initial[service.id] = buildInitialSchedule(
        data.expert.id,
        service,
        data.days,
        index,
        data.defaultTime,
      );
    });
    return initial;
  });

  const totalPrice = useMemo(
    () => services.reduce((sum, s) => sum + s.price, 0),
    [services],
  );
  const totalMinutes = useMemo(
    () => services.reduce((sum, s) => sum + durationToMinutes(s.duration), 0),
    [services],
  );

  const addService = (service: ServiceItem) =>
    setServices((prev) =>
      prev.some((s) => s.id === service.id) ? prev : [...prev, service],
    );

  const removeService = (id: string) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  // Keep per-service schedules in sync when services are added or removed.
  useEffect(() => {
    setSchedules((prev) => {
      const next = { ...prev };
      services.forEach((service, index) => {
        if (!next[service.id]) {
          next[service.id] = buildInitialSchedule(
            expert.id,
            service,
            days,
            index,
            defaultTime,
          );
        }
      });
      for (const id of Object.keys(next)) {
        if (!services.some((s) => s.id === id)) delete next[id];
      }
      return next;
    });
  }, [services, expert.id, days, defaultTime]);

  // If every service is removed, send the user back to pick services again.
  useEffect(() => {
    if (services.length === 0) {
      router.replace(`/experts/${expert.id}`);
    }
  }, [services.length, expert.id, router]);

  const allScheduled = services.every((s) => {
    const sch = schedules[s.id];
    return Boolean(sch?.dayId && sch?.time);
  });

  const scheduleLabel =
    services.length === 1
      ? formatScheduleLabel(
          days.find((d) => d.id === schedules[services[0]?.id ?? ""]?.dayId),
          schedules[services[0]?.id ?? ""]?.time ?? "",
        )
      : `${services.length} services scheduled`;

  const canCheckout = services.length > 0 && allScheduled;

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
          <ScheduleServicesSection
            expertId={expert.id}
            services={services}
            currency={currency}
            days={days}
            defaultTime={defaultTime}
            schedules={schedules}
            onSchedulesChange={setSchedules}
            onRemoveService={removeService}
          />
          <SuggestedServices
            expertId={expert.id}
            services={suggestedServices}
            currency={currency}
            selectedIds={new Set(services.map((s) => s.id))}
            onAdd={addService}
          />
          <LocationCard expert={expert} variant="mobile" />
          <MobileSummary
            count={services.length}
            totalDuration={formatTotalDuration(totalMinutes)}
            totalPrice={`${currency}${totalPrice}`}
          />
        </div>

        {/* ===== Desktop ===== */}
        <div className="hidden space-y-5 lg:block">
          <DesktopHeader expert={expert} />

          <ScheduleServicesSection
            expertId={expert.id}
            services={services}
            currency={currency}
            days={days}
            defaultTime={defaultTime}
            schedules={schedules}
            onSchedulesChange={setSchedules}
            onRemoveService={removeService}
          />

          <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <SuggestedServices
              expertId={expert.id}
              services={suggestedServices}
              currency={currency}
              selectedIds={new Set(services.map((s) => s.id))}
              onAdd={addService}
            />
            <LocationCard expert={expert} variant="desktop" />
          </div>

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
  compact = false,
}: {
  label: string;
  value: string;
  action: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 ${compact ? "py-2" : "py-3.5"}`}
    >
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
      <h2
        className={`px-4 font-[family-name:var(--font-heading)] font-bold text-(--text-primary) ${
          variant === "mobile"
            ? "pb-0 pt-3 text-base"
            : "pb-1 pt-4 text-lg lg:text-xl"
        }`}
      >
        Choose your location
      </h2>
      <div
        className={`flex flex-col ${variant === "desktop" ? "flex-1 justify-center" : "pb-2"}`}
      >
        <LocationRow
          label="Expert Location"
          value={expertLocation}
          compact={variant === "mobile"}
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
          compact={variant === "mobile"}
        />
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
    <section className="flex min-h-0 flex-col rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] lg:h-full lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-(--text-primary) lg:text-xl">
          Suggested Services
        </h3>
        <Link
          href={buildAddServicesHref(expertId, selectedIds)}
          className="flex items-center gap-1 text-xs font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary)"
        >
          View all
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain scroll-smooth scrollbar-none [-webkit-overflow-scrolling:touch] lg:min-h-[6.5rem] lg:gap-3 lg:flex-1">
        {services.map((service) => {
          const added = selectedIds.has(service.id);
          return (
            <article
              key={service.id}
              className="relative flex w-[calc((100%-1rem)/2.5)] shrink-0 flex-col items-center gap-1.5 rounded-xl border border-(--border) bg-(--bg-card) p-2.5 pb-10 lg:w-[calc((100%-1.5rem)/3)] lg:flex-row lg:items-center lg:gap-3 lg:p-3 lg:pb-3"
            >
              <span className="relative mt-1 h-14 w-14 shrink-0 overflow-hidden rounded-full lg:mt-0 lg:h-16 lg:w-16">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1023px) 56px, 64px"
                  className="object-cover"
                />
              </span>

              <div className="flex w-full min-w-0 flex-col items-center gap-0.5 px-1 text-center lg:flex-1 lg:items-start lg:justify-center lg:px-0 lg:text-left">
                <h4 className="line-clamp-2 w-full text-xs font-semibold leading-snug text-(--text-primary) lg:text-sm">
                  {service.name}
                </h4>
                <p className="w-full text-[10px] text-(--text-secondary) lg:hidden">
                  {service.duration}
                </p>
                <p className="w-full text-[11px] font-semibold text-(--brand-gold) lg:hidden">
                  {currency}
                  {service.price}
                </p>
                <p className="mt-0.5 hidden w-full text-xs text-(--text-secondary) lg:block">
                  {service.duration} ·{" "}
                  <span className="font-semibold text-(--brand-gold)">
                    {currency}
                    {service.price}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => onAdd(service)}
                disabled={added}
                aria-label={`Add ${service.name}`}
                className={`absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors lg:static lg:ml-auto lg:shrink-0 lg:self-center lg:h-8 lg:w-8 ${
                  added
                    ? "primary-button text-white"
                    : "border border-(--border) bg-(--bg-card) text-(--accent-primary) hover:border-(--accent-primary)"
                }`}
              >
                <Plus size={15} strokeWidth={2.2} />
              </button>
            </article>
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
