"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchBar, FilterDrawer } from "@umestay/ui/composite";
import type { SearchParams, FilterState } from "@umestay/ui/composite";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const router = useRouter();
  const t = useTranslations("home");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const buildSearch = (params: SearchParams, f: FilterState) => {
    const qs = new URLSearchParams();
    if (params.location) qs.set("q", params.location);
    if (params.checkin)  qs.set("checkin", params.checkin);
    if (params.checkout) qs.set("checkout", params.checkout);
    if (params.guests)   qs.set("guests", String(params.guests));
    if (f.type)          qs.set("type", f.type);
    if (f.minPrice)      qs.set("minPrice", String(f.minPrice));
    if (f.maxPrice)      qs.set("maxPrice", String(f.maxPrice));
    return qs.toString();
  };

  const handleSearch = (params: SearchParams) => {
    router.push(`/${locale}/properties?${buildSearch(params, filters)}`);
  };

  const handleFilterApply = (f: FilterState) => {
    setFilters(f);
  };

  return (
    // <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
    <section className="relative min-h-[220px] flex items-center justify-center bg-white">
      {/* subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
      {/* 左上角标签 */}
      {/* <div className="absolute top-4 left-4 flex items-center">
        <img src="/logo.png" alt="Umestay" width={38} height={38} className="rounded-lg"/>
        <span className="text-lg font-bold text-stone-800">Umestay</span>
        <div className="ml-12 flex items-center gap-1.5 bg-primary-50 rounded-full px-3 py-1 text-xs font-medium text-primary-800 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block" />
          JAPAN · 日租 & 月租
        </div>
      </div> */}

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-16 text-center">
        
        {/* <h1 className="text-4xl md:text-5xl font-black text-primary-500 mb-3 leading-tight tracking-tight"> */}
        <h1 className="text-3xl md:text-4xl font-black text-primary-500 mb-8 leading-tight tracking-tight">
          {t("hero_title")}
        </h1>
        {/* <p className="text-primary-900 text-lg mb-10">{t("hero_subtitle")}</p> */}

        <div className="flex items-center justify-center gap-2">
          <SearchBar
            onSearch={handleSearch}
            locale={locale as "zh" | "ja" | "en"}
            className="w-full max-w-[700px]"
          />
          <button
            onClick={() => setFilterOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 h-11 px-4 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            {locale === "zh" ? "筛选" : locale === "ja" ? "絞り込み" : "Filter"}
            {!!(filters.type ||
              (filters.minPrice && filters.minPrice > 0) ||
              (filters.maxPrice && filters.maxPrice > 0) ||
              (filters.amenities && filters.amenities.length > 0) ||
              filters.bedrooms ||
              filters.bathrooms ||
              filters.beds ||
              filters.guests) && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        </div>

        <FilterDrawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          value={filters}
          onChange={handleFilterApply}
          locale={locale as "zh" | "ja" | "en"}
        />
      </div>
    </section>
  );
}
