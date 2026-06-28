import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-(--border) bg-(--bg-card) px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--bg-secondary) text-(--text-muted)">
        <SearchX size={22} strokeWidth={1.6} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-(--text-primary) lg:text-base">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-(--text-secondary)">{description}</p>
    </div>
  );
}
