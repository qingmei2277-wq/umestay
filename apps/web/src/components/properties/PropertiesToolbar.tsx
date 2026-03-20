"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FilterDrawer } from "@umestay/ui/composite";
import type { FilterState } from "@umestay/ui/composite";

type Locale = "zh" | "ja" | "en";

interface PropertiesToolbarProps {
  locale: Locale;
  count: number;
  searchParams: Record<string, string | undefined>;
}

const SORT_OPTIONS = {
  zh: [
    { value: "rating",     label: "评分最高" },
    { value: "price_asc",  label: "价格从低到高" },
    { value: "price_desc", label: "价格从高到低" },
    { value: "newest",     label: "最新上架" },
  ],
  ja: [
    { value: "rating",     label: "評価が高い順" },
    { value: "price_asc",  label: "価格が安い順" },
    { value: "price_desc", label: "価格が高い順" },
    { value: "newest",     label: "新着順" },
  ],
  en: [
    { value: "rating",     label: "Top rated" },
    { value: "price_asc",  label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
    { value: "newest",     label: "Newest first" },
  ],
};

const FILTER_LABEL = { zh: "筛选", ja: "絞り込み", en: "Filter" };
const COUNT_LABEL = {
  zh: (n: number) => `共 ${n} 套房源`,
  ja: (n: number) => `${n}件の物件`,
  en: (n: number) => `${n} properties`,
};

function buildUrl(pathname: string, sp: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...sp, ...patch };
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== "") params.set(k, v);
  }
  // reset page on filter change
  params.delete("page");
  return `${pathname}?${params.toString()}`;
}

export function PropertiesToolbar({ locale, count, searchParams }: PropertiesToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentSort = searchParams.sort ?? "rating";

  const filterValue: FilterState = {
    ...(searchParams.type === "daily" || searchParams.type === "monthly"
      ? { type: searchParams.type }
      : {}),
    ...(searchParams.minPrice ? { minPrice: Number(searchParams.minPrice) } : {}),
    ...(searchParams.maxPrice ? { maxPrice: Number(searchParams.maxPrice) } : {}),
    ...(searchParams.guests ? { guests: Number(searchParams.guests) } : {}),
  };

  const applyFilters = (f: FilterState) => {
    router.push(
      buildUrl(pathname, searchParams, {
        type: f.type,
        minPrice: f.minPrice !== undefined ? String(f.minPrice) : undefined,
        maxPrice: f.maxPrice !== undefined ? String(f.maxPrice) : undefined,
        guests: f.guests !== undefined ? String(f.guests) : undefined,
      })
    );
  };

  const sortOptions = SORT_OPTIONS[locale];

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">{COUNT_LABEL[locale](count)}</p>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) =>
              router.push(buildUrl(pathname, searchParams, { sort: e.target.value }))
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Filter button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 hover:border-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            {FILTER_LABEL[locale]}
          </button>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        value={filterValue}
        onChange={applyFilters}
        locale={locale}
      />
    </>
  );
}
