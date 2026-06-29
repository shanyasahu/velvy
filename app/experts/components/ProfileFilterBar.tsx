"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  CircleSlash,
  Globe,
  MapPin,
  MonitorSmartphone,
  SlidersHorizontal,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

import { useClickOutside } from "./lib/useClickOutside";

interface FilterField {
  id: string;
  label: string;
  defaultValue: string;
  options: string[];
  icon: ComponentType<LucideProps>;
}

const FILTER_FIELDS: FilterField[] = [
  {
    id: "suburbs",
    label: "Suburbs",
    defaultValue: "All Melbourne",
    icon: MapPin,
    options: [
      "All Melbourne",
      "CBD",
      "Southbank",
      "Richmond",
      "St Kilda",
      "Carlton",
      "Fitzroy",
      "Brunswick",
    ],
  },
  {
    id: "language",
    label: "Language",
    defaultValue: "All Languages",
    icon: Globe,
    options: [
      "All Languages",
      "English",
      "Hindi",
      "Mandarin",
      "Arabic",
      "Spanish",
      "Gujarati",
    ],
  },
  {
    id: "gender",
    label: "Gender",
    defaultValue: "All",
    icon: Users,
    options: ["All", "Female", "Male", "Non-binary"],
  },
  {
    id: "price",
    label: "Price",
    defaultValue: "Any Price",
    icon: CircleDollarSign,
    options: ["Any Price", "$0 - $50", "$50 - $100", "$100 - $200", "$200+"],
  },
  {
    id: "availability",
    label: "Online / Offline",
    defaultValue: "All",
    icon: MonitorSmartphone,
    options: ["All", "Online", "In-person", "Home Visit"],
  },
  {
    id: "age",
    label: "Age",
    defaultValue: "Any Age",
    icon: CalendarDays,
    options: ["Any Age", "18 - 25", "26 - 35", "36 - 45", "46+"],
  },
];

interface ProfileFilterBarProps {
  /** Called when "Apply Filters" is pressed. */
  onApply?: (values: Record<string, string>) => void;
}

export function ProfileFilterBar({ onApply }: ProfileFilterBarProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(FILTER_FIELDS.map((f) => [f.id, f.defaultValue])),
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const handleClear = () => {
    setValues(
      Object.fromEntries(FILTER_FIELDS.map((f) => [f.id, f.defaultValue])),
    );
  };

  return (
    <div className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-2.5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_FIELDS.map((field) => (
          <FilterField
            key={field.id}
            field={field}
            value={values[field.id]}
            open={openId === field.id}
            onToggle={() =>
              setOpenId((prev) => (prev === field.id ? null : field.id))
            }
            onClose={() => setOpenId(null)}
            onSelect={(value) => {
              setValues((prev) => ({ ...prev, [field.id]: value }));
              setOpenId(null);
            }}
          />
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:text-(--accent-primary)"
          >
            <CircleSlash size={14} strokeWidth={1.8} />
            Clear All
          </button>
          <button
            type="button"
            onClick={() => onApply?.(values)}
            className="primary-button flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
          >
            <SlidersHorizontal size={14} strokeWidth={1.8} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterField({
  field,
  value,
  open,
  onToggle,
  onClose,
  onSelect,
}: {
  field: FilterField;
  value: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { icon: Icon } = field;

  useClickOutside(containerRef, onClose, open);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--bg-card) px-3 py-2 text-left transition-colors hover:border-(--accent-primary)"
      >
        <Icon size={16} strokeWidth={1.8} className="shrink-0 text-(--accent-primary)" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] text-(--text-muted)">{field.label}</span>
          <span className="text-xs font-semibold text-(--text-primary)">
            {value}
          </span>
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className={`ml-1 shrink-0 text-(--text-muted) transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-2 max-h-64 min-w-[180px] overflow-y-auto rounded-xl border border-(--border) bg-(--bg-card) py-1.5 shadow-lg"
        >
          {field.options.map((option) => {
            const isActive = option === value;
            return (
              <li key={option} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => onSelect(option)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-(--bg-secondary) ${
                    isActive
                      ? "font-medium text-(--accent-primary)"
                      : "text-(--text-primary)"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isActive && (
                    <Check size={13} strokeWidth={2} className="shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
