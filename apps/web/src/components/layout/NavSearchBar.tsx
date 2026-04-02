"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@umestay/ui/composite";
import type { SearchParams } from "@umestay/ui/composite";

type Locale = "zh" | "ja" | "en";

const L = (locale: Locale, zh: string, ja: string, en: string) =>
  locale === "zh" ? zh : locale === "ja" ? ja : en;

function formatDate(dateStr: string, locale: Locale) {
  const [, m, d] = dateStr.split("-");
  if (!m || !d) return dateStr;
  if (locale === "en") return `${parseInt(m)}/${parseInt(d)}`;
  return `${parseInt(m)}月${parseInt(d)}日`;
}

interface NavSearchBarProps {
  locale: Locale;
}

export function NavSearchBar({ locale }: NavSearchBarProps) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const sp = useSearchParams();

  const q        = sp.get("q") ?? "";
  const checkin  = sp.get("checkin") ?? "";
  const checkout = sp.get("checkout") ?? "";
  const guests   = sp.get("guests") ? Number(sp.get("guests")) : 0;

  // 点击外部时收起
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const handleSearch = (params: SearchParams) => {
    setExpanded(false);
    const qs = new URLSearchParams();
    if (params.location) qs.set("q", params.location);
    if (params.checkin)  qs.set("checkin", params.checkin);
    if (params.checkout) qs.set("checkout", params.checkout);
    if (params.guests)   qs.set("guests", String(params.guests));
    router.push(`/${locale}/properties?${qs.toString()}`);
  };

  const dateLabel = checkin && checkout
    ? `${formatDate(checkin, locale)} – ${formatDate(checkout, locale)}`
    : checkin ? formatDate(checkin, locale) : null;

  const guestLabel = guests > 0
    ? L(locale, `${guests}位客人`, `${guests}名`, `${guests} guest${guests !== 1 ? "s" : ""}`)
    : L(locale, "添加人数", "人数を追加", "Add guests");

  // ── 展开状态：完整搜索框（fixed 定位，不推动页面内容）──
  if (expanded) {
    return (
      <>
        {/* 背景遮罩，位于 Nav(z-300) 下方 */}
        <div className="fixed inset-0 bg-black/00 z-[290]" onClick={() => setExpanded(false)} />
        {/* 搜索框：紧贴 Nav 底部向下展开，覆盖页面内容 */}
        <div
          ref={ref}
          className="fixed top-[18px] left-1/2 -translate-x-1/2 z-[310] w-full max-w-[700px] px-4 pt-3"
        >
          <SearchBar
            // value={{ location: q || undefined, checkin: checkin || undefined, checkout: checkout || undefined, guests: guests || undefined }}
            value={{
              ...(q        && { location: q }),
              ...(checkin  && { checkin }),
              ...(checkout && { checkout }),
              ...(guests   && { guests }),
            }}
            onSearch={handleSearch}
            locale={locale}
            className="w-full"
          />
        </div>
      </>
    );
  }

  // ── 收起状态：小胶囊 ─────────────────────────────────
  return (
    <div
      ref={ref}
      onClick={() => setExpanded(true)}
      className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer h-10 text-sm select-none"
    >
      {/* 地点 */}
      <span className="px-4 font-semibold text-gray-900 whitespace-nowrap max-w-[160px] truncate">
        {q || L(locale, "搜索目的地", "目的地を検索", "Destination")}
      </span>

      <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

      {/* 日期 */}
      <span className="px-4 text-gray-600 whitespace-nowrap">
        {dateLabel ?? L(locale, "任意时间", "いつでも", "Any time")}
      </span>

      <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

      {/* 人数 */}
      <span className="pl-4 pr-2 text-gray-600 whitespace-nowrap">
        {guestLabel}
      </span>

      {/* 搜索按钮 */}
      <div className="pr-1.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
