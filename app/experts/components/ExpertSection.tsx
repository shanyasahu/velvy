"use client";

import { useRef, type RefObject } from "react";
import { ArrowRight } from "lucide-react";
import { SwiperSlide } from "swiper/react";

import type { Expert } from "../experts.types";
import { EmptyState } from "./EmptyState";
import { ExpertCard } from "./ExpertCard";
import { ExpertSlider, type ExpertSliderHandle } from "./ExpertSlider";

interface ExpertSectionProps {
  title: string;
  experts: Expert[];
  countLabel?: string;
  viewAllLabel?: string;
  /** Slot rendered on the right of the header (e.g. "View on Map"). */
  headerAction?: React.ReactNode;
  headingLevel?: "h1" | "h2";
  /** Use compact card sizing (mobile sections) */
  compact?: boolean;
  /** Optional ref to control the section slider (e.g. "View all" / "More") */
  sliderRef?: RefObject<ExpertSliderHandle | null>;
}

export function ExpertSection({
  title,
  experts,
  countLabel,
  viewAllLabel = "View all",
  headerAction,
  headingLevel = "h2",
  compact = false,
  sliderRef: externalSliderRef,
}: ExpertSectionProps) {
  const internalSliderRef = useRef<ExpertSliderHandle>(null);
  const sliderRef = externalSliderRef ?? internalSliderRef;
  const Heading = headingLevel;

  const viewAllControl = viewAllLabel ? (
    <button
      type="button"
      onClick={() => sliderRef.current?.slideNext()}
      className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary) lg:text-sm"
    >
      {viewAllLabel}
      <ArrowRight size={14} strokeWidth={2} />
    </button>
  ) : null;

  return (
    <section className="space-y-3 lg:space-y-4">
      {(title || countLabel || headerAction || viewAllLabel) && (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title ? (
              <Heading className="truncate text-sm font-semibold text-(--text-primary) lg:text-lg">
                {title}
              </Heading>
            ) : null}
            {countLabel && (
              <p className="mt-0.5 text-[10px] text-(--text-secondary) lg:text-xs">
                {countLabel}
              </p>
            )}
          </div>

          {headerAction ?? viewAllControl}
        </div>
      )}

      {experts.length > 0 ? (
        <ExpertSlider ref={sliderRef} loop={experts.length > 4}>
          {experts.map((expert) => (
            <SwiperSlide key={expert.id}>
              <ExpertCard expert={expert} compact={compact} />
            </SwiperSlide>
          ))}
        </ExpertSlider>
      ) : (
        <EmptyState
          title="No experts found"
          description="Try adjusting your filters or selecting a different category."
        />
      )}
    </section>
  );
}
