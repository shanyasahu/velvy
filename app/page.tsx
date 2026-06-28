import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageSquare,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Velvy | Beauty · Wellness · Yours",
  description:
    "Discover and book verified beauty, wellness, and grooming experts near you.",
};

const quickLinks = [
  {
    label: "Browse Experts",
    description: "Find verified beauty, wellness & grooming pros near you.",
    href: "/experts",
    icon: Users,
  },
  {
    label: "My Bookings",
    description: "View and manage your upcoming appointments.",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Offers",
    description: "Explore the latest deals and seasonal packages.",
    href: "/offers",
    icon: Tag,
  },
  {
    label: "Messages",
    description: "Chat directly with your favourite experts.",
    href: "/messages",
    icon: MessageSquare,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-(--bg-primary) pb-24 lg:pb-12">
      <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6 lg:py-12">
        <section className="overflow-hidden rounded-3xl border border-(--border) bg-(--gradient-card) px-6 py-12 shadow-[var(--shadow-card)] lg:px-12 lg:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--bg-card) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-gold)">
            <Sparkles size={13} strokeWidth={1.8} className="fill-(--brand-gold)" />
            Beauty · Wellness · Yours
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-(--text-primary) lg:text-5xl">
            Discover & book the experts who make you feel your best.
          </h1>

          <p className="mt-4 max-w-xl text-sm text-(--text-secondary) lg:text-base">
            Browse verified beauty, wellness, and grooming professionals near
            you — compare ratings, prices, and availability, all in one place.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/experts"
              className="primary-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Explore Experts
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link
              href="/offers"
              className="secondary-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-(--text-primary) transition-colors hover:border-(--accent-primary)"
            >
              View Offers
            </Link>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {quickLinks.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--bg-card) p-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--accent-primary) hover:shadow-[var(--shadow-card)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl primary-button text-white">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="text-base font-semibold text-(--text-primary)">
                {label}
              </span>
              <span className="text-xs text-(--text-secondary)">
                {description}
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-(--accent-primary) opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight size={13} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
