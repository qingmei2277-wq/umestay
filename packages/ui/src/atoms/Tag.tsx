import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

// ── Generic Tag ───────────────────────────────────────────────────────────────

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "default" | "navy" | "gold" | "green" | "red" | "amber";
}

const colorClasses: Record<NonNullable<TagProps["color"]>, string> = {
  default: "bg-primary-50 text-gray-700",
  navy:    "bg-primary text-white",
  gold:    "bg-accent text-white",
  green:   "bg-green-100 text-green-700",
  red:     "bg-red-100 text-red-700",
  amber:   "bg-amber-100 text-amber-700",
};

export function Tag({ color = "default", children, className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap leading-tight",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ── TypeTag — daily / monthly ─────────────────────────────────────────────────

type PropertyType = "daily" | "monthly";

const TYPE_LABELS: Record<PropertyType, Record<"zh" | "ja" | "en", string>> = {
  daily:   { zh: "日租", ja: "デイリー", en: "Daily" },
  monthly: { zh: "月租", ja: "マンスリー", en: "Monthly" },
};

interface TypeTagProps {
  type: PropertyType;
  locale?: "zh" | "ja" | "en";
}

export function TypeTag({ type, locale = "zh" }: TypeTagProps) {
  return <Tag color="navy">{TYPE_LABELS[type][locale]}</Tag>;
}

// ── FeaturedTag ───────────────────────────────────────────────────────────────

interface FeaturedTagProps {
  label?: string;
}

export function FeaturedTag({ label = "精选" }: FeaturedTagProps) {
  return <Tag color="gold">{label}</Tag>;
}

// ── MetaTag — bedroom / guest count etc. ─────────────────────────────────────

interface MetaTagProps {
  icon?: React.ReactNode;
  value: string | number;
}

export function MetaTag({ icon, value }: MetaTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-gray-700 whitespace-nowrap">
      {icon}
      {value}
    </span>
  );
}
