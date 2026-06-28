import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  Eye,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";

import type { Expert } from "../experts.types";

interface ExpertCardProps {
  expert: Expert;
  /** Tighter typography for mobile slider cards */
  compact?: boolean;
}

export function ExpertCard({ expert, compact = false }: ExpertCardProps) {
  const profileHref = `/specificexpert/${expert.id}`;

  const nameClass = compact
    ? "truncate text-[10px] font-semibold text-(--text-primary)"
    : "truncate text-[10px] font-semibold text-(--text-primary) sm:text-xs lg:text-sm";

  const specialtyClass = compact
    ? "mt-0.5 truncate text-[9px] text-(--text-secondary)"
    : "mt-0.5 truncate text-[9px] text-(--text-secondary) sm:text-[10px] lg:text-[11px]";

  const metaClass = compact
    ? "flex items-center gap-1.5 text-[8px] text-(--text-muted)"
    : "flex items-center gap-2 text-[8px] text-(--text-muted) sm:text-[9px] lg:text-[10px]";

  const tagClass = compact
    ? "rounded-md bg-(--bg-secondary) px-1 py-0.5 text-[7px] font-medium text-(--text-secondary)"
    : "rounded-md bg-(--bg-secondary) px-1.5 py-0.5 text-[7px] font-medium text-(--text-secondary) sm:text-[8px] lg:text-[9px]";

  const priceClass = compact
    ? "text-[9px] font-bold text-(--text-primary)"
    : "text-xs font-bold text-(--text-primary) sm:text-sm lg:text-base";

  // Mobile: full-width stacked buttons. sm+: equal-width row.
  const actionClass =
    "flex h-7 w-full items-center justify-center gap-1 rounded-lg text-[10px] font-medium sm:h-7 sm:flex-1 sm:text-[9px] lg:h-8 lg:text-[10px]";

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <Link
          href={profileHref}
          aria-label={`View ${expert.name}'s profile`}
          className="absolute inset-0"
        >
          <Image
            src={expert.image}
            alt={expert.name}
            fill
            sizes="(max-width: 640px) 28vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div
        className={`flex flex-1 flex-col ${compact ? "gap-1 p-2" : "gap-1.5 p-2 sm:gap-2 sm:p-2.5 lg:p-3"}`}
      >
        <div>
          <div className="flex items-center gap-1">
            <Link href={profileHref} className={nameClass}>
              {expert.name}
            </Link>
            {expert.verified && (
              <BadgeCheck
                size={compact ? 12 : 14}
                strokeWidth={1.8}
                className="shrink-0 text-(--brand-gold)"
              />
            )}
          </div>
          <p className={specialtyClass}>{expert.specialty}</p>
        </div>

        <div className={metaClass}>
          <span className="flex items-center gap-0.5">
            <Star
              size={compact ? 9 : 10}
              className="fill-(--brand-gold) text-(--brand-gold)"
            />
            <span className="font-medium text-(--text-secondary)">
              {expert.rating.toFixed(1)}
            </span>
            ({expert.reviews})
          </span>
          <span className="flex min-w-0 items-center gap-0.5">
            <MapPin size={compact ? 9 : 10} strokeWidth={1.8} className="shrink-0" />
            <span className="truncate">{expert.distance}</span>
          </span>
        </div>

        {expert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {expert.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={tagClass}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[9px] text-(--text-muted) sm:text-[10px] lg:text-[11px]">
          From <span className={priceClass}>{expert.currency}{expert.price}</span>
        </p>

        <div className="mt-auto flex flex-col gap-1 pt-0.5 sm:flex-row sm:items-center">
          <Link
            href="/booking"
            className={`primary-button text-white ${actionClass}`}
          >
            <CalendarCheck size={12} strokeWidth={1.8} />
            Book
          </Link>

          <Link
            href={`/specificexpertmessage/${expert.id}`}
            className={`${actionClass} border border-(--border) bg-(--bg-card) text-(--text-primary) transition-colors hover:border-(--accent-primary)`}
          >
            <MessageSquare size={12} strokeWidth={1.8} />
            Message
          </Link>

          <Link
            href={profileHref}
            aria-label={`View ${expert.name}'s profile`}
            className="flex h-7 w-full items-center justify-center gap-1 rounded-lg border border-(--border) bg-(--bg-card) text-[10px] font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary) sm:w-8 sm:text-[0px] lg:h-8 lg:w-9"
          >
            <Eye size={13} strokeWidth={1.8} />
            <span className="sm:hidden">View</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
