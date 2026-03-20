"use client";

import { cn } from "../utils/cn";

type Locale = "zh" | "ja" | "en";

const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中文",
  ja: "日本語",
  en: "EN",
};

interface LocaleSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}

export function LocaleSwitcher({ locale, onChange, className }: LocaleSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {(["zh", "ja", "en"] as Locale[]).map((l, i) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={cn(
            "px-2 py-1 text-xs font-medium transition-colors",
            i < 2 && "border-r border-gray-200",
            locale === l ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-800"
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
