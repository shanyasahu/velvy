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
  CalendarCheck,
  Check,
  Clock,
  Eye,
  Globe,
  Languages,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";

import type {
  ExpertProfile,
  ServiceItem,
  TopCategory,
} from "../experts.types";
import { getIcon } from "../components/icons";
import { ProfileFilterBar } from "../components/ProfileFilterBar";
import { TopCategoriesSidebar } from "../components/TopCategoriesSidebar";
import { ChatPanel } from "./ChatPanel";
import { buildBookingHref } from "../../booking/components/lib/bookingUrl";
import { ServiceSelectionAlert } from "../../booking/components/ServiceSelectionAlert";

type ProfileTab = "profile" | "message";

interface ExpertProfileContentProps {
  expert: ExpertProfile;
  topCategories: TopCategory[];
  /** Tab to open on first render (e.g. "message" when arriving from Message). */
  initialTab?: ProfileTab;
  /** Services to pre-select (e.g. when returning from booking to add more). */
  initialServiceIds?: string[];
}

export function ExpertProfileContent({
  expert,
  topCategories,
  initialTab = "profile",
  initialServiceIds = [],
}: ExpertProfileContentProps) {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState(
    expert.serviceCategories[0]?.id ?? "",
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialServiceIds),
  );
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [showServiceAlert, setShowServiceAlert] = useState(false);

  const activeCategory =
    expert.serviceCategories.find((c) => c.id === activeCategoryId) ??
    expert.serviceCategories[0];

  const allServices = useMemo(
    () => expert.serviceCategories.flatMap((c) => c.services),
    [expert.serviceCategories],
  );

  const selectedServices = useMemo(
    () => allServices.filter((service) => selectedIds.has(service.id)),
    [allServices, selectedIds],
  );

  const selectedTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const priceFrom = allServices.length
    ? Math.min(...allServices.map((s) => s.price))
    : expert.price;

  const toggleService = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goToBooking = () => {
    if (selectedIds.size === 0) {
      setShowServiceAlert(true);
      return;
    }
    router.push(buildBookingHref(expert.id, selectedIds));
  };

  const ratingMax = Math.max(
    1,
    ...expert.ratingBreakdown.map((bucket) => bucket.count),
  );

  return (
    <main className="min-h-screen bg-(--bg-primary) pb-32 lg:pb-12">
      <div className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 lg:space-y-5 lg:px-6 lg:py-6">
        {/* ===== Mobile layout ===== */}
        <div className="lg:hidden">
          <Link
            href="/experts"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-card) px-3 py-1.5 text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            Back to Experts
          </Link>

          <MobileLayout
            expert={expert}
            activeCategoryId={activeCategoryId}
            onCategorySelect={setActiveCategoryId}
            selectedIds={selectedIds}
            onToggleService={toggleService}
            ratingMax={ratingMax}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onGoToBooking={goToBooking}
          />
        </div>

        {/* ===== Desktop layout ===== */}
        <div className="hidden lg:block">
          <ProfileFilterBar />
        </div>

        <div className="hidden lg:flex lg:gap-6">
          <TopCategoriesSidebar
            categories={topCategories}
            activeId="beauty"
            onSelect={() => router.push("/experts")}
          />

          <div className="min-w-0 flex-1">
            <Link
              href="/experts"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-card) px-3 py-1.5 text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              Back to Experts
            </Link>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <DesktopProfileColumn
                expert={expert}
                ratingMax={ratingMax}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onGoToBooking={goToBooking}
              />

              <ServicesPanel
                expert={expert}
                activeCategoryId={activeCategoryId}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategoryId}
                selectedIds={selectedIds}
                onToggleService={toggleService}
                onGoToBooking={goToBooking}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile sticky booking bar ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-(--border) bg-(--bg-card)/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[10px] text-(--text-muted)">
              {selectedServices.length > 0 ? "Total" : "From"}
            </p>
            <p className="text-lg font-bold text-(--text-primary)">
              {expert.currency}
              {selectedServices.length > 0 ? selectedTotal : priceFrom}
            </p>
          </div>
          <button
            type="button"
            onClick={goToBooking}
            className="primary-button flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white"
          >
            <CalendarCheck size={16} strokeWidth={1.8} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* ===== Floating cart (mobile) ===== */}
      {selectedServices.length > 0 && (
        <button
          type="button"
          aria-label={`${selectedServices.length} services in cart`}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full primary-button text-white shadow-[var(--shadow-glow)] lg:hidden"
        >
          <ShoppingCart size={20} strokeWidth={1.8} />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-(--brand-gold) text-[10px] font-bold text-white">
            {selectedServices.length}
          </span>
        </button>
      )}
      <ServiceSelectionAlert
        open={showServiceAlert}
        onClose={() => setShowServiceAlert(false)}
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.round(rating)
              ? "fill-(--brand-gold) text-(--brand-gold)"
              : "text-(--text-muted)"
          }
        />
      ))}
    </span>
  );
}

function ActionButtons({
  activeTab,
  onSelectTab,
  onGoToBooking,
  onViewProfile,
}: {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onGoToBooking: () => void;
  onViewProfile?: () => void;
}) {
  const tabClass = (active: boolean) =>
    `flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-medium transition-colors ${
      active
        ? "border-(--accent-primary) bg-(--bg-secondary) text-(--accent-primary)"
        : "border-(--border) bg-(--bg-card) text-(--text-primary) hover:border-(--accent-primary)"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onGoToBooking}
        className="primary-button flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-white"
      >
        <CalendarCheck size={15} strokeWidth={1.8} className="shrink-0" />
        Book Now
      </button>
      <button
        type="button"
        onClick={() => onSelectTab("message")}
        aria-pressed={activeTab === "message"}
        className={tabClass(activeTab === "message")}
      >
        <MessageSquare size={15} strokeWidth={1.8} className="shrink-0" />
        Message
      </button>
      <button
        type="button"
        onClick={onViewProfile ?? (() => onSelectTab("profile"))}
        aria-pressed={activeTab === "profile"}
        className={tabClass(activeTab === "profile")}
      >
        <Eye size={15} strokeWidth={1.8} className="shrink-0" />
        <span className="truncate">View Profile</span>
      </button>
    </div>
  );
}

function OverallRatingCard({ expert }: { expert: ExpertProfile }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-(--bg-secondary) p-4">
      <p className="text-4xl font-bold text-(--text-primary)">
        {expert.rating.toFixed(1)}
      </p>
      <Stars rating={expert.rating} size={16} />
      <p className="mt-1 text-[11px] text-(--text-muted)">Overall Rating</p>
    </div>
  );
}

function RatingBreakdown({
  expert,
  ratingMax,
}: {
  expert: ExpertProfile;
  ratingMax: number;
}) {
  return (
    <div className="flex flex-col justify-center gap-2">
      {expert.ratingBreakdown.map((bucket) => (
        <div key={bucket.stars} className="flex items-center gap-2">
          <span className="flex w-7 items-center gap-0.5 text-[11px] text-(--text-secondary)">
            {bucket.stars}
            <Star size={11} className="fill-(--brand-gold) text-(--brand-gold)" />
          </span>
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-(--bg-secondary)">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${(bucket.count / ratingMax) * 100}%`,
                background: "var(--gradient-primary)",
              }}
            />
          </span>
          <span className="w-7 text-right text-[11px] text-(--text-muted)">
            {bucket.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: ExpertProfile["reviewList"][number];
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={review.avatar}
          alt={review.author}
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-(--text-primary)">
            {review.author}
          </p>
          <span className="text-[11px] text-(--text-muted)">{review.date}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Stars rating={review.rating} size={12} />
          <span className="text-[11px] font-medium text-(--text-secondary)">
            {review.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

function ReviewsBlock({
  expert,
  ratingMax,
}: {
  expert: ExpertProfile;
  ratingMax: number;
}) {
  const [activeReview, setActiveReview] = useState(0);
  const [paused, setPaused] = useState(false);
  const reviews = expert.reviewList;
  const current = reviews[activeReview] ?? reviews[0];

  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, reviews.length]);

  return (
    <section className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 lg:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
          Reviews ({expert.reviews})
        </h2>
        <Link
          href="#"
          className="flex items-center gap-1 text-xs font-medium text-(--accent-secondary) hover:text-(--accent-primary)"
        >
          View All
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>

      {/* Desktop: overall · breakdown · single review with dots */}
      <div className="mt-4 hidden items-center gap-6 lg:grid lg:grid-cols-[170px_minmax(0,1fr)_minmax(0,1.05fr)]">
        <OverallRatingCard expert={expert} />
        <RatingBreakdown expert={expert} ratingMax={ratingMax} />

        <div
          className="border-l border-(--border) pl-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {current && <ReviewCard review={current} />}

          {reviews.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`Show review ${index + 1}`}
                  onClick={() => setActiveReview(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeReview
                      ? "w-5 bg-(--accent-primary)"
                      : "w-1.5 bg-(--border) hover:bg-(--text-muted)"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: overall + breakdown, then stacked list */}
      <div className="lg:hidden">
        <div className="mt-4 grid grid-cols-[110px_minmax(0,1fr)] gap-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4">
          <OverallRatingCard expert={expert} />
          <RatingBreakdown expert={expert} ratingMax={ratingMax} />
        </div>

        <ul className="mt-5 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border-t border-(--border) pt-4 first:border-t-0 first:pt-0"
            >
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop                                                             */
/* ------------------------------------------------------------------ */

function InfoGrid({
  expert,
  scrollAnchorRef,
}: {
  expert: ExpertProfile;
  scrollAnchorRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const infoItems = [
    { icon: Globe, label: "Nationality", value: expert.nationality },
    { icon: Languages, label: "Languages", value: expert.languages.join(", ") },
    { icon: Award, label: "Experience", value: expert.experienceSummary },
    { icon: Sparkles, label: "Specialization", value: expert.specialization },
    { icon: MapPin, label: "Location", value: `${expert.distance} from you` },
    { icon: Clock, label: "Availability", value: expert.availabilityHours },
  ];

  const renderItem = (
    { icon: Icon, label, value }: (typeof infoItems)[number],
    key: string,
  ) => (
    <div
      key={key}
      className="flex flex-col items-center gap-1.5 text-center"
    >
      <span className="primary-button flex h-10 w-10 items-center justify-center rounded-full text-white">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="text-[11px] font-semibold text-(--text-primary)">
        {label}
      </span>
      <span className="text-[10px] leading-tight text-(--text-secondary)">
        {value}
      </span>
    </div>
  );

  return (
    <div
      ref={scrollAnchorRef}
      className="scroll-mt-24 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4"
    >
      {/* Mobile: 3-column grid so every highlight is fully visible */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 lg:hidden">
        {infoItems.map((item) => renderItem(item, item.label))}
      </div>

      {/* Desktop: 3×2 grid */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-3">
        {infoItems.map((item) => renderItem(item, item.label))}
      </div>
    </div>
  );
}

function SkillsSection({ expert }: { expert: ExpertProfile }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 lg:p-5">
      <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
        Skills &amp; Expertise
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {expert.skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-xs font-medium text-(--text-secondary)"
          >
            <Sparkles size={12} strokeWidth={1.8} className="text-(--brand-gold)" />
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function DesktopProfileColumn({
  expert,
  ratingMax,
  activeTab,
  onSelectTab,
  onGoToBooking,
}: {
  expert: ExpertProfile;
  ratingMax: number;
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onGoToBooking: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid items-stretch gap-4 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="relative h-full min-h-[200px] overflow-hidden rounded-[var(--radius-md)]">
          <Image
            src={expert.coverImage}
            alt={expert.name}
            fill
            sizes="240px"
            className="object-cover"
            priority
          />
          {expert.availableToday && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-(--success) px-2.5 py-1 text-[10px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Available Today
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-(--text-primary)">
              {expert.name}
            </h1>
            {expert.verified && (
              <BadgeCheck size={20} strokeWidth={1.8} className="text-(--accent-primary)" />
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-(--accent-secondary)">
              {expert.specialty}
            </span>
            <span className="rounded-full bg-(--bg-secondary) px-2.5 py-0.5 text-[11px] font-medium text-(--accent-primary)">
              {expert.experienceBadge}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <Star size={15} className="fill-(--brand-gold) text-(--brand-gold)" />
              <span className="font-semibold text-(--text-primary)">
                {expert.rating.toFixed(1)}
              </span>
              ({expert.reviews} Reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={15} strokeWidth={1.8} className="text-(--brand-gold)" />
              {expert.distance}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
            {expert.about}
          </p>

          <div className="pt-4">
            <ActionButtons
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onGoToBooking={onGoToBooking}
            />
          </div>
        </div>
      </div>

      {activeTab === "message" ? (
        <div className="h-[560px]">
          <ChatPanel expert={expert} />
        </div>
      ) : (
        <>
          <InfoGrid expert={expert} />
          <SkillsSection expert={expert} />
          <ReviewsBlock expert={expert} ratingMax={ratingMax} />
        </>
      )}
    </div>
  );
}

function ServicesPanel({
  expert,
  activeCategoryId,
  activeCategory,
  onCategorySelect,
  selectedIds,
  onToggleService,
  onGoToBooking,
}: {
  expert: ExpertProfile;
  activeCategoryId: string;
  activeCategory: ExpertProfile["serviceCategories"][number] | undefined;
  onCategorySelect: (id: string) => void;
  selectedIds: Set<string>;
  onToggleService: (id: string) => void;
  onGoToBooking: () => void;
}) {
  return (
    <aside className="grid h-fit grid-cols-[88px_minmax(0,1fr)] items-start gap-3 lg:sticky lg:top-20">
      {/* Category rail */}
      <nav className="flex h-fit flex-col gap-1.5 self-start rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-2">
        {expert.serviceCategories.map((category) => {
          const Icon = getIcon(category.icon);
          const active = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategorySelect(category.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center transition-colors ${
                active
                  ? "primary-button text-white"
                  : "border border-(--border) bg-(--bg-secondary) text-(--text-primary) hover:border-(--accent-primary)"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[9px] font-medium leading-tight">
                {category.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Services grid */}
      <div className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3">
        <ServicesGrid
          title={`Popular ${activeCategory?.label ?? ""} Services`}
          services={activeCategory?.services ?? []}
          currency={expert.currency}
          selectedIds={selectedIds}
          onToggleService={onToggleService}
          gridClassName="grid grid-cols-3 gap-2.5"
          columns={3}
          rowsPerPage={4}
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="col-span-2">
          <SelectedServicesBar count={selectedIds.size} onGoToBooking={onGoToBooking} />
        </div>
      )}
    </aside>
  );
}

function SelectedServicesBar({
  count,
  onGoToBooking,
}: {
  count: number;
  onGoToBooking: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-(--accent-primary) bg-(--bg-card) px-3 py-2.5">
      <span className="flex items-center gap-2">
        <Sparkles size={16} strokeWidth={1.8} className="shrink-0 text-(--brand-gold)" />
        <span className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-(--text-primary)">
            {count} {count === 1 ? "service" : "services"} selected
          </span>
          <span className="text-[11px] text-(--text-secondary)">
            Continue to customize your booking
          </span>
        </span>
      </span>
      <button
        type="button"
        onClick={onGoToBooking}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-(--border) px-3 py-1.5 text-[11px] font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
      >
        View Selected
        <ArrowRight size={12} strokeWidth={2} />
      </button>
    </div>
  );
}

function ServicesGrid({
  title,
  services,
  currency,
  selectedIds,
  onToggleService,
  gridClassName,
  columns,
  rowsPerPage,
}: {
  title: string;
  services: ServiceItem[];
  currency: string;
  selectedIds: Set<string>;
  onToggleService: (id: string) => void;
  gridClassName: string;
  columns: number;
  /** Fixed number of rows per page. When omitted, rows are measured to fill. */
  rowsPerPage?: number;
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    rowsPerPage ? rowsPerPage * columns : columns * 3,
  );
  const gridRef = useRef<HTMLDivElement>(null);

  // Either use a fixed number of rows, or measure how many real card rows fit
  // in the available height. Only the overflow gets paginated.
  useEffect(() => {
    if (rowsPerPage) {
      setPerPage(rowsPerPage * columns);
      return;
    }

    const el = gridRef.current;
    if (!el) return;

    const compute = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-service-card]");
      if (cards.length === 0) return;
      let cardHeight = 0;
      cards.forEach((card) => {
        cardHeight = Math.max(cardHeight, card.offsetHeight);
      });
      if (cardHeight === 0) return;

      const styles = window.getComputedStyle(el);
      const rowGap = parseFloat(styles.rowGap) || 0;
      const available = el.clientHeight;
      if (!available) return;
      const rows = Math.max(
        1,
        Math.floor((available + rowGap) / (cardHeight + rowGap)),
      );
      setPerPage(rows * columns);
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [columns, rowsPerPage, services]);

  const totalPages = Math.max(1, Math.ceil(services.length / perPage));

  useEffect(() => {
    setPage(1);
  }, [services]);

  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const pageItems = services.slice(start, start + perPage);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-(--text-primary)">
          {title}
        </h3>
      </div>

      <div
        ref={gridRef}
        className={`mt-3 flex-1 auto-rows-fr items-stretch ${gridClassName}`}
      >
        {pageItems.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            currency={currency}
            selected={selectedIds.has(service.id)}
            onToggle={() => onToggleService(service.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              aria-current={num === currentPage}
              className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors ${
                num === currentPage
                  ? "primary-button text-white"
                  : "border border-(--border) text-(--text-secondary) hover:border-(--accent-primary)"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 items-center gap-1 rounded-lg border border-(--border) px-2.5 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  currency,
  selected,
  onToggle,
}: {
  service: ServiceItem;
  currency: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-service-card
      onClick={onToggle}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-(--bg-card) text-left transition-all ${
        selected
          ? "border-(--accent-primary) shadow-[var(--shadow-glow)]"
          : "border-(--border) hover:border-(--accent-primary)"
      }`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="140px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
            selected
              ? "border-(--accent-primary) bg-(--accent-primary) text-white"
              : "border-white/70 bg-black/30 text-transparent"
          }`}
        >
          <Check size={12} strokeWidth={2.5} />
        </span>
      </div>
      <div className="flex min-h-[3.25rem] flex-1 flex-col gap-0.5 p-1.5">
        <p className="line-clamp-2 min-h-[2rem] text-[10px] font-semibold leading-tight text-(--text-primary)">
          {service.name}
        </p>
        <p className="text-[10px] font-bold text-(--brand-gold)">
          {currency}
          {service.price}
        </p>
        <div className="mt-auto flex items-center justify-between pt-0.5">
          <span className="flex items-center gap-0.5 text-[8px] font-medium text-(--text-secondary)">
            <Clock size={9} strokeWidth={1.8} />
            {service.duration}
          </span>
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
              selected
                ? "bg-(--accent-primary) text-white"
                : "border border-(--border) text-(--accent-primary)"
            }`}
          >
            {selected ? <Check size={10} strokeWidth={2.5} /> : <Plus size={10} strokeWidth={2.5} />}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */

function MobileLayout({
  expert,
  activeCategoryId,
  onCategorySelect,
  selectedIds,
  onToggleService,
  ratingMax,
  activeTab,
  onSelectTab,
  onGoToBooking,
}: {
  expert: ExpertProfile;
  activeCategoryId: string;
  onCategorySelect: (id: string) => void;
  selectedIds: Set<string>;
  onToggleService: (id: string) => void;
  ratingMax: number;
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onGoToBooking: () => void;
}) {
  const activeCategory =
    expert.serviceCategories.find((c) => c.id === activeCategoryId) ??
    expert.serviceCategories[0];
  const selectedCount = selectedIds.size;
  const profileHighlightsRef = useRef<HTMLDivElement>(null);

  const scrollToProfileDetails = () => {
    onSelectTab("profile");
    const scroll = () => {
      profileHighlightsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    // Wait for profile content to mount when coming from the message tab.
    window.setTimeout(scroll, activeTab === "message" ? 100 : 0);
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)">
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
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-(--success) px-2 py-0.5 text-[10px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Available Today
            </span>
          )}
        </div>

        <div className="relative px-4 pb-3">
          <div className="flex items-end gap-3">
            <span className="relative -mt-7 block h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-(--bg-card) bg-(--bg-secondary)">
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>

            <div className="min-w-0 flex-1 pb-0.5">
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

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--text-secondary)">
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
              {expert.languages.join(", ")}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">
            {expert.about}
          </p>

          <div className="mt-3">
            <ActionButtons
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onGoToBooking={onGoToBooking}
              onViewProfile={scrollToProfileDetails}
            />
          </div>
        </div>
      </div>

      {activeTab === "message" ? (
        <div className="h-[540px]">
          <ChatPanel expert={expert} />
        </div>
      ) : (
        <>
      {/* Services */}
      <section>
        <h2 className="font-[family-name:var(--font-logo)] text-2xl font-bold text-(--accent-primary)">
          services
        </h2>

        <div className="mt-3 grid grid-cols-[72px_minmax(0,1fr)] items-start gap-2">
          <nav className="flex h-fit flex-col gap-1.5 self-start">
            {expert.serviceCategories.map((category) => {
              const Icon = getIcon(category.icon);
              const active = category.id === activeCategoryId;
              const countInCat = category.services.filter((s) =>
                selectedIds.has(s.id),
              ).length;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategorySelect(category.id)}
                  className={`relative flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-center transition-colors ${
                    active
                      ? "primary-button text-white"
                      : "border border-(--border) bg-(--bg-secondary) text-(--text-primary)"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.8} />
                  <span className="text-[8px] font-medium leading-tight">
                    {category.label}
                  </span>
                  {countInCat > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--brand-gold) text-[9px] font-bold text-white">
                      {countInCat}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <ServicesGrid
            title={activeCategory?.label ?? ""}
            services={activeCategory?.services ?? []}
            currency={expert.currency}
            selectedIds={selectedIds}
            onToggleService={onToggleService}
            gridClassName="grid grid-cols-3 gap-1.5"
            columns={3}
          />
        </div>

        {selectedCount > 0 && (
          <div className="mt-3">
            <SelectedServicesBar count={selectedCount} onGoToBooking={onGoToBooking} />
          </div>
        )}
      </section>

      <div className="space-y-5">
        <InfoGrid expert={expert} scrollAnchorRef={profileHighlightsRef} />
        <SkillsSection expert={expert} />
        <ReviewsBlock expert={expert} ratingMax={ratingMax} />
      </div>
        </>
      )}
    </div>
  );
}
