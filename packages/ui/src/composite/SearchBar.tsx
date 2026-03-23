"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../utils/cn";
import { DualCalendar } from "./DualCalendar";

type Locale = "zh" | "ja" | "en";

export interface SearchParams {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
}

interface SearchBarProps {
  value?: SearchParams;
  onSearch: (params: SearchParams) => void;
  locale?: Locale;
  compact?: boolean;
  popularAreas?: string[];
  className?: string;
}

type Panel = "location" | "dates" | "guests" | null;

const L = (locale: Locale, zh: string, ja: string, en: string) =>
  locale === "zh" ? zh : locale === "ja" ? ja : en;

export function SearchBar({
  value,
  onSearch,
  locale = "zh",
  compact = false,
  popularAreas = ["新宿区", "豊島区", "渋谷区", "中野区", "武蔵野市"],
  className,
}: SearchBarProps) {
  const [open, setOpen]         = useState<Panel>(null);
  const [hoveredPanel, setHoveredPanel] = useState<Panel>(null);
  const [loc, setLoc]           = useState(value?.location ?? "");
  const [cin, setCin]           = useState(value?.checkin ?? "");
  const [cout, setCout]         = useState(value?.checkout ?? "");
  const [adults, setAdults]     = useState(Math.max(1, value?.guests ?? 1));
  const [children, setChildren] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const guests    = adults + children;
  function formatDate(dateStr: string, locale: Locale) {
    const parts = dateStr.split("-");
    const month = parseInt(parts[1] ?? "0");
    const day = parseInt(parts[2] ?? "0");
    if (locale === "zh") return `${month}月${day}日`;
    if (locale === "ja") return `${month}月${day}日`;
    return `${month}/${day}`;  // 英文用 4/1 格式
    }

  const dateLabel = cin && cout
    ? `${formatDate(cin, locale)} - ${formatDate(cout, locale)}`
    : cin ? formatDate(cin, locale) : null;

  const doSearch = () => {
    setOpen(null);
    onSearch({ location: loc, checkin: cin, checkout: cout, guests });
  };

function Seg({
  id,
  label,
  value: val,
  placeholder,
  hasBorder,
}: {
  id: Panel;
  label: string;
  value: string | null;
  placeholder: string;
  hasBorder: boolean;
}) {
  const active = open === id;
  const nextPanel = id === "location" ? "dates" : id === "dates" ? "guests" : null;

  // 自己被 hover/active，或右侧相邻段被 hover/active，竖线消失
  const hideDivider =
    active ||
    hoveredPanel === id ||
    open === nextPanel ||
    hoveredPanel === nextPanel;

  return (
    <div
      className="relative flex-1 flex items-center"
      onMouseEnter={() => setHoveredPanel(id)}
      onMouseLeave={() => setHoveredPanel(null)}
    >
      <div
        onClick={() => setOpen(active ? null : id)}
        className={cn(
          "flex-1 px-6 py-3 cursor-pointer transition-colors min-w-0 rounded-full",
          active || hoveredPanel === id ? "bg-gray-100" : "",
        )}
      >
        <div className="text-[10px] font-bold text-gray-900 tracking-widest uppercase mb-0.5">
          {label}
        </div>
        <div className={cn(
          "text-sm truncate",
          val ? "text-gray-900 font-medium" : "text-gray-400"
        )}>
          {val ?? placeholder}
        </div>
      </div>

      {hasBorder && (
        <div className={cn(
          "absolute right-0 w-px bg-gray-200 transition-opacity duration-150",
          "h-[55%]",
          hideDivider ? "opacity-0" : "opacity-100"
        )} />
      )}
    </div>
  );
}

  return (
    <div ref={ref} className={cn("relative z-50", className)}>
      {/* Capsule */}
      <div className={cn(
        "flex items-center bg-white border border-gray-200 rounded-full overflow-hidden transition-shadow",
        open ? "shadow-[0_8px_40px_rgba(0,0,0,.12)]" : "shadow-sm",
        compact && "max-w-[560px]"
      )}>
        <Seg
          id="location"
          label={L(locale, "地点", "場所", "Where")}
          value={loc || null}
          placeholder={L(locale, "搜索目的地", "目的地を検索", "Search destination")}
          hasBorder
        />
        <Seg
          id="dates"
          label={L(locale, "时间", "日程", "When")}
          value={dateLabel}
          placeholder={L(locale, "选择日期", "日程を選択", "Add dates")}
          hasBorder
        />
        <Seg
          id="guests"
          label={L(locale, "人数", "人数", "Who")}
          value={guests > 0 ? L(locale, `${guests}位`, `${guests}名`, `${guests} guest${guests > 1 ? "s" : ""}`) : null}
          placeholder={L(locale, "添加人数", "人数を追加", "Add guests")}
          hasBorder={false}
        />

        {/* Search button */}
        <div className="pr-2 pl-1 flex-shrink-0">
          <button
            onClick={doSearch}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-600 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Location dropdown */}
      {open === "location" && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-80 z-[100] bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,.12)] border border-gray-200 overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              <input
                autoFocus
                value={loc}
                onChange={e => setLoc(e.target.value)}
                placeholder={L(locale, "搜索区域、车站…", "エリア・駅で検索…", "Area, station…")}
                className="border-none outline-none text-sm text-gray-900 bg-transparent flex-1 min-w-0"
              />
              {loc && (
                <button onClick={() => setLoc("")}>
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="px-2 pb-3">
            <p className="text-[10px] font-semibold text-gray-400 px-2 py-1 tracking-widest uppercase">
              {L(locale, "热门区域", "人気エリア", "Popular areas")}
            </p>
            {popularAreas.map(area => (
              <button
                key={area}
                onClick={() => { setLoc(area); setOpen("dates"); }}
                className="flex items-center gap-2.5 w-full px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{area}</p>
                  <p className="text-xs text-gray-400">東京都</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date picker */}
      {open === "dates" && (
        <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-[100]">
          <DualCalendar
            checkin={cin}
            checkout={cout}
            onRangeChange={(start, end) => { setCin(start); setCout(end); }}
            onClose={() => setOpen("guests")}
            locale={locale}
          />
        </div>
      )}

      {/* Guests dropdown */}
      {open === "guests" && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-72 z-[100] bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,.12)] border border-gray-200 p-5">
          <p className="text-sm font-bold text-gray-900 mb-4">
            {L(locale, "添加人数", "人数を追加", "Add guests")}
          </p>
          {([
            [L(locale, "成人", "大人", "Adults"), L(locale, "13岁以上", "13歳以上", "Ages 13+"), adults, setAdults, 1] as const,
            [L(locale, "儿童", "子供", "Children"), L(locale, "2–12岁", "2〜12歳", "Ages 2–12"), children, setChildren, 0] as const,
          ]).map(([label, sub, val, setVal, min]) => (
            <div key={label} className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVal(v => Math.max(min, v - 1))}
                  disabled={val <= min}
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center text-lg font-light transition-colors",
                    val <= min
                      ? "border-gray-200 text-gray-300 cursor-default"
                      : "border-gray-300 text-gray-700 hover:border-primary cursor-pointer"
                  )}
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-900 min-w-[20px] text-center">{val}</span>
                <button
                  onClick={() => setVal(v => v + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-light text-gray-700 hover:border-primary transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={doSearch}
            className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            {L(locale, "搜索", "検索", "Search")}
          </button>
        </div>
      )}
    </div>
  );
}
