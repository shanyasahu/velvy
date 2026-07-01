"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

interface ScheduleDropdownPanelProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  minWidth?: number;
  /** When set, panel uses this exact width instead of matching the anchor. */
  fixedWidth?: number;
  /** Extra space reserved at the bottom of the viewport (e.g. mobile sticky bars). */
  bottomInset?: number;
}

function getDefaultBottomInset(): number {
  if (typeof window === "undefined") return 12;
  return window.innerWidth < 1024 ? 160 : 12;
}

export function ScheduleDropdownPanel({
  open,
  onClose,
  anchorRef,
  children,
  className = "",
  minWidth = 0,
  fixedWidth,
  bottomInset,
}: ScheduleDropdownPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const gap = 6;
      const viewportPadding = 12;
      const reservedBottom = bottomInset ?? getDefaultBottomInset();
      const bottomLimit = window.innerHeight - viewportPadding - reservedBottom;
      const panelHeight = panel?.offsetHeight ?? 240;
      const panelWidth = fixedWidth ?? Math.max(rect.width, minWidth);
      const maxLeft = window.innerWidth - panelWidth - viewportPadding;
      const left = Math.max(
        viewportPadding,
        Math.min(rect.left, maxLeft),
      );

      let top = rect.bottom + gap;
      let maxHeight: number | undefined;

      if (top + panelHeight > bottomLimit) {
        const spaceBelow = bottomLimit - top;
        const spaceAbove = rect.top - gap - viewportPadding;

        if (spaceBelow >= 140) {
          maxHeight = spaceBelow;
        } else if (spaceAbove > spaceBelow) {
          const height = Math.min(panelHeight, spaceAbove);
          top = rect.top - gap - height;
          maxHeight = height;
        } else {
          maxHeight = Math.max(120, spaceBelow);
        }
      }

      setStyle({
        position: "fixed",
        top,
        left,
        width: panelWidth,
        maxHeight,
        overflowY: maxHeight ? "auto" : undefined,
        zIndex: 1000,
        visibility: "visible",
      });
    };

    updatePosition();
    const frame = requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorRef, minWidth, fixedWidth, bottomInset, children]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className={`rounded-xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
}
