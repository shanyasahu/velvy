"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, MessageSquare, Share2, Star, Video } from "lucide-react";

import type { FeaturedExpert } from "../experts.types";
import { FeaturedServicesSlider } from "./FeaturedServicesSlider";

interface FeaturedExpertCardProps {
  expert: FeaturedExpert;
}

export function FeaturedExpertCard({ expert }: FeaturedExpertCardProps) {
  const profileHref = `/specificexpert/${expert.id}`;

  const handleShare = async () => {
    const shareData = {
      title: expert.name,
      text: expert.tagline,
      url:
        typeof window !== "undefined"
          ? `${window.location.origin}${profileHref}`
          : profileHref,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      /* user cancelled or share unsupported */
    }
  };

  return (
    <section className="feature-card overflow-hidden rounded-[var(--radius-md)] p-4">
      <div className="flex items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-lg font-bold text-(--text-primary)">
              {expert.name}
            </h2>
            {expert.verified && (
              <BadgeCheck size={18} strokeWidth={1.8} className="shrink-0 text-(--brand-gold)" />
            )}
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share ${expert.name}'s profile`}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-(--brand-gold) text-(--brand-gold) transition-colors hover:bg-(--bg-secondary)"
            >
              <Share2 size={10} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-(--brand-gold) text-(--brand-gold)" />
              <span className="font-semibold text-(--text-primary)">
                {expert.rating.toFixed(1)}
              </span>
              ({expert.reviews})
            </span>
            <span className="text-(--text-muted)">|</span>
            <span className="flex items-center gap-1">
              <MapPin size={13} strokeWidth={1.8} className="text-(--brand-gold)" />
              {expert.distance}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-(--text-secondary)">
            {expert.tagline}
          </p>
        </div>

        <Link
          href={profileHref}
          className="relative aspect-[16/10] w-2/5 max-w-[200px] shrink-0 self-stretch overflow-hidden rounded-xl"
          aria-label={`Watch ${expert.name}'s intro video`}
        >
          <Image
            src={expert.videoThumbnail}
            alt={`${expert.name} intro`}
            fill
            sizes="(max-width: 640px) 40vw, 200px"
            className="object-cover"
          />
          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
            <Video size={12} strokeWidth={1.8} />
          </span>
        </Link>
      </div>

      <div className="mt-4">
        <FeaturedServicesSlider services={expert.services} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={profileHref}
          className="flex h-9 flex-1 items-center justify-center rounded-lg border border-(--border) bg-(--bg-card) text-[11px] font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
        >
          View Profile
        </Link>
        <Link
          href="/booking"
          className="primary-button flex h-9 flex-1 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
        >
          Book Now
        </Link>
        <Link
          href={`/specificexpertmessage/${expert.id}`}
          className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-(--brand-gold) text-[11px] font-medium text-(--brand-gold) transition-colors hover:bg-(--bg-secondary)"
        >
          <MessageSquare size={13} strokeWidth={1.8} />
          Message
        </Link>
      </div>
    </section>
  );
}
