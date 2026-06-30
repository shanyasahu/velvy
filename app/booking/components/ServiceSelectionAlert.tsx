"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart } from "lucide-react";

interface ServiceSelectionAlertProps {
  open: boolean;
  onClose: () => void;
  /** Label for the primary action button. Defaults to "Got it". */
  actionLabel?: string;
  /** Called when the primary action button is pressed (after closing). */
  onAction?: () => void;
}

/**
 * Portal-rendered modal shown when a user tries to book without selecting any
 * service. Rendered into `document.body` so it overlays the whole app.
 */
export function ServiceSelectionAlert({
  open,
  onClose,
  actionLabel = "Got it",
  onAction,
}: ServiceSelectionAlertProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // The modal only ever opens after a client-side interaction, so it never
  // renders during SSR — safe to portal straight into the document body.
  if (!open || typeof document === "undefined") return null;

  const handleAction = () => {
    onClose();
    onAction?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="service-alert-title"
        aria-describedby="service-alert-desc"
        className="w-full max-w-sm rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--bg-secondary) text-(--accent-primary)">
          <ShoppingCart size={20} strokeWidth={1.8} />
        </div>
        <h2
          id="service-alert-title"
          className="mt-3 text-lg font-bold text-(--text-primary)"
        >
          Select a service first
        </h2>
        <p
          id="service-alert-desc"
          className="mt-1.5 text-sm text-(--text-secondary)"
        >
          Please choose at least one service before continuing to booking.
        </p>
        <div className="mt-5 flex items-center gap-2">
          {onAction && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 flex-1 items-center justify-center rounded-xl border border-(--border) text-sm font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleAction}
            className="primary-button flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-semibold text-white"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
