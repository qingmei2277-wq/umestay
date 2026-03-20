"use client";

import { useState } from "react";
import { cn } from "../utils/cn";

type Locale = "zh" | "ja" | "en";

const MONTH_NAMES: Record<Locale, string[]> = {
  zh: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

const DAY_NAMES: Record<Locale, string[]> = {
  zh: ["日","一","二","三","四","五","六"],
  ja: ["日","月","火","水","木","金","土"],
  en: ["Su","Mo","Tu","We","Th","Fr","Sa"],
};

const LABELS = {
  checkin:    { zh: "入住",    ja: "チェックイン",   en: "Check-in"  },
  checkout:   { zh: "退房",    ja: "チェックアウト", en: "Check-out" },
  addDate:    { zh: "选择日期", ja: "日程を選択",     en: "Add date"  },
  nights:     { zh: "晚",      ja: "泊",             en: "nights"    },
  clear:      { zh: "清除日期", ja: "クリア",         en: "Clear dates" },
  close:      { zh: "关闭",    ja: "閉じる",         en: "Close"     },
};

function fmt(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function parse(s: string | null | undefined): Date | null {
  return s ? new Date(`${s}T00:00:00`) : null;
}

export interface DualCalendarProps {
  checkin?: string | null;
  checkout?: string | null;
  blockedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  onRangeChange: (start: string, end: string) => void;
  onClose?: () => void;
  locale?: Locale;
}

export function DualCalendar({
  checkin,
  checkout,
  blockedDates = [],
  minDate,
  maxDate,
  onRangeChange,
  onClose,
  locale = "zh",
}: DualCalendarProps) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const effectiveMin = minDate ?? todayStart;

  const [viewYear, setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hover, setHover]         = useState<string | null>(null);
  const [step, setStep]           = useState<"cin" | "cout">(checkin ? "cout" : "cin");

  const cin  = checkin ?? "";
  const cout = checkout ?? "";
  const cinD  = parse(cin);
  const coutD = parse(cout);

  const rm = viewMonth === 11 ? 0 : viewMonth + 1;
  const ry = viewMonth === 11 ? viewYear + 1 : viewYear;

  const prevMonth = () =>
    viewMonth === 0
      ? (setViewMonth(11), setViewYear(y => y - 1))
      : setViewMonth(m => m - 1);

  const nextMonth = () =>
    viewMonth === 11
      ? (setViewMonth(0), setViewYear(y => y + 1))
      : setViewMonth(m => m + 1);

  const isBlocked = (d: Date) =>
    blockedDates.some(b => b.toDateString() === d.toDateString());

  const handleDay = (d: Date) => {
    const ds = fmt(d);
    if (step === "cin" || (cinD && coutD)) {
      onRangeChange(ds, "");
      setStep("cout");
    } else {
      if (cinD && d < cinD) {
        onRangeChange(ds, "");
        setStep("cout");
      } else {
        onRangeChange(cin, ds);
        setStep("cin");
      }
    }
  };

  const isInRange = (d: Date) => {
    if (!cinD) return false;
    const end = step === "cout" && hover ? parse(hover) : coutD;
    if (!end) return false;
    return d > cinD && d < end;
  };

  const nights =
    cinD && coutD ? Math.ceil((coutD.getTime() - cinD.getTime()) / 86400000) : null;

  function renderMonth(year: number, month: number) {
    const first = new Date(year, month, 1);
    const total = new Date(year, month + 1, 0).getDate();
    const startDow = first.getDay();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));

    const mNames = MONTH_NAMES[locale] ?? MONTH_NAMES.en;
    const dNames = DAY_NAMES[locale] ?? DAY_NAMES.en;

    return (
      <div className="flex-1 min-w-0">
        <p className="text-center text-sm font-semibold text-gray-900 mb-3">
          {mNames[month]} {year}
        </p>
        <div className="grid grid-cols-7 text-center mb-1.5">
          {dNames.map(d => (
            <span key={d} className="text-[11px] text-gray-400 font-medium py-0.5">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const ds      = fmt(d);
            const past    = d < effectiveMin;
            const blocked = isBlocked(d);
            const disabled = past || blocked || (maxDate ? d > maxDate : false);
            const isStart = cinD && ds === cin;
            const isEnd   = coutD && ds === cout;
            const inRange = isInRange(d);
            const marked = isStart || isEnd;

            return (
              <div
                key={i}
                onMouseEnter={() => !disabled && setHover(ds)}
                onMouseLeave={() => setHover(null)}
                onClick={() => !disabled && handleDay(d)}
                className={cn(
                  "h-9 flex items-center justify-center",
                  (inRange || marked) && "bg-primary-50",  // ← 加上 marked
                  isStart && "rounded-l-full",             // ← 左端圆角
                  isEnd   && "rounded-r-full",             // ← 右端圆角
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-normal transition-colors",
                    marked   && "bg-primary text-white font-bold",
                    !marked && !disabled && "hover:bg-gray-100 cursor-pointer",
                    disabled && "text-gray-300 cursor-default"
                  )}
                >
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const l = (key: keyof typeof LABELS) =>
    (LABELS[key] as Record<Locale, string>)[locale] ?? LABELS[key].en;

  return (
    <div className="bg-white rounded-xl shadow-modal border border-gray-200 p-5 w-[640px]">
      {/* Status bar */}
      <div className="flex gap-2 mb-4">
        {([["cin", l("checkin"), cin] as const, ["cout", l("checkout"), cout] as const]).map(
          ([s, label, val]) => (
            <div
              key={s}
              className={cn(
                "flex-1 px-3 py-1.5 rounded-lg border",
                step === s ? "bg-primary-50 border-primary/30" : "bg-gray-50 border-gray-200"
              )}
            >
              <p className={cn("text-[10px] font-bold tracking-widest uppercase mb-0.5",
                step === s ? "text-primary" : "text-gray-400")}>{label}</p>
              <p className={cn("text-sm font-medium", val ? "text-gray-900" : "text-gray-400")}>
                {val || l("addDate")}
              </p>
            </div>
          )
        )}
        {nights && (
          <div className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-primary">{nights}</span>
            <span className="text-[10px] text-gray-400">{l("nights")}</span>
          </div>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dual months */}
      <div className="flex gap-6">
        {renderMonth(viewYear, viewMonth)}
        <div className="w-px bg-gray-200 flex-shrink-0" />
        {renderMonth(ry, rm)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-200">
        <button
          onClick={() => { onRangeChange("", ""); setStep("cin"); }}
          className="text-sm text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          {l("clear")}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            {l("close")}
          </button>
        )}
      </div>
    </div>
  );
}
