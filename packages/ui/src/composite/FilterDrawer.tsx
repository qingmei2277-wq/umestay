"use client";

import { useState } from "react";
import { cn } from "../utils/cn";
import { Btn } from "../atoms/Btn";
import type { ReactElement } from "react";
type Locale = "zh" | "ja" | "en";

type AmenityItem = {
  id: string;
  zh: string;
  ja: string;
  en: string;
  icon: ReactElement;
};


export interface FilterState {
  type?: "daily" | "monthly";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  guests?: number;
  amenities?: string[];
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  value: FilterState;
  onChange: (filters: FilterState) => void;
  locale?: Locale;
}

const L = (locale: Locale, zh: string, ja: string, en: string) =>
  locale === "zh" ? zh : locale === "ja" ? ja : en;

const PRICE_PRESETS = [
  [0, 10000],
  [10000, 50000],
  [50000, 100000],
  [100000, 200000],
] as const;

const PRICE_LABELS = (locale: Locale) => [
  L(locale, "¥1万以下", "¥1万以下", "<¥10k"),
  "¥1–5万",
  "¥5–10万",
  L(locale, "¥10万+", "¥10万+", "¥100k+"),
];

const AMENITY_GROUPS = [
  {
    group: { zh: "热门", ja: "人気", en: "Popular" },
    items: [
      { id: "wifi",    zh: "无线网络", ja: "Wi-Fi",      en: "WiFi",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" /></svg> },
      // { id: "ac",      zh: "空调",     ja: "エアコン",   en: "A/C",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" /></svg> },
      { id: "ac", zh: "空调", ja: "エアコン", en: "A/C", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={1.5} className="w-4 h-4 lucide lucide-snowflake-icon lucide-snowflake" stroke-linecap="round" stroke-linejoin="round"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/></svg> },
       { id: "heat",    zh: "暖气",     ja: "暖房",       en: "Heating",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg> },
      { id: "parking", zh: "免费停车", ja: "駐車場", en: "Parking", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 0 1 0 6H9" /><rect x="3" y="3" width="18" height="18" rx="2" /></svg> },
      { id: "dryer",   zh: "烘干机",   ja: "乾燥機",     en: "Dryer",     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 lucide lucide-washing-machine-icon lucide-washing-machine" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3"/><path d="M17 6h.01"/><rect width="18" height="20" x="3" y="2" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5"/></svg>},
      { id: "iron",    zh: "熨斗",     ja: "アイロン",   en: "Iron",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M12 19v2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 4h7.459a3 3 0 0 1 2.959 2.507l.577 3.464l.81 4.865a1 1 0 0 1 -.985 1.164h-16.82a7 7 0 0 1 7 -7h9.8"/><path d="M8 19l-1 2"/><path d="M16 19l1 2"/></svg> },
    ],
  },
  {
    group: { zh: "必备", ja: "必須", en: "Essentials" },
    items: [
      { id: "kitchen", zh: "厨房",     ja: "キッチン",   en: "Kitchen",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-utensils-icon lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg> },
      { id: "tv",      zh: "电视机",     ja: "テレビ",     en: "TV",        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875C21 4.254 20.496 3.75 19.875 3.75H4.125C3.504 3.75 3 4.254 3 4.875v11.25c0 .621.504 1.125 1.125 1.125z" /></svg> },
      { id: "washer",  zh: "洗衣机",   ja: "洗濯機",     en: "Washer",    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><circle cx="7" cy="7" r="1" fill="currentColor" /></svg> },
      { id: "iron",    zh: "吹风机",     ja: "ヘアドライヤー",   en: "Hairdryer",      icon: <svg viewBox="0 0 32 32" fill="currentColor" stroke="currentColor" strokeWidth={0.2} className="w-4 h-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 27v.2a4 4 0 0 1-3.8 3.8H4v-2h6.15a2 2 0 0 0 1.84-1.84L12 27zM10 1c.54 0 1.07.05 1.58.14l.38.07 17.45 3.65a2 2 0 0 1 1.58 1.79l.01.16v6.38a2 2 0 0 1-1.43 1.91l-.16.04-13.55 2.83 1.76 6.5A2 2 0 0 1 15.87 27l-.18.01h-3.93a2 2 0 0 1-1.88-1.32l-.05-.15-1.88-6.76A9 9 0 0 1 10 1zm5.7 24-1.8-6.62-1.81.38a9 9 0 0 1-1.67.23h-.33L11.76 25zM10 3a7 7 0 1 0 1.32 13.88l.33-.07L29 13.18V6.8L11.54 3.17A7.03 7.03 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>},
      { id: "desk",    zh: "工作区",   ja: "ワーク",     en: "Workspace", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg> },
    ],
  },
  {
    group: { zh: "其他", ja: "その他", en: "Others" },
    items: [
      { id: "kitchen", zh: "婴儿床",     ja: "ベビーベッド",   en: "crib",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v7a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v4M10 10v5M14 10v5M17 11v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 18v2M19 18v2" />
    </svg> },
      { id: "kitchen", zh: "游泳池",     ja: "プール",   en: "Swimming pool",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 16c1.5 0 1.5-2 3-2s1.5 2 3 2 1.5-2 3-2 1.5 2 3 2 1.5-2 3-2 1.5 2 3 2" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 20c1.5 0 1.5-2 3-2s1.5 2 3 2 1.5-2 3-2 1.5 2 3 2 1.5-2 3-2 1.5 2 3 2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 5a2 2 0 100-4 2 2 0 000 4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v4l-4 3" /></svg> },
      { id: "kitchen", zh: "热水浴缸",     ja: "ジャグジー",   en: "Hot tub",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V7a2 2 0 012-2h1a2 2 0 012 2v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 6c0-1 .5-2 1.5-2M10 6c0-1 .5-2 1.5-2M13 6c0-1 .5-2 1.5-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18l-1 2M18 18l1 2" /></svg> },
      { id: "kitchen", zh: "烧烤架",     ja: "バーベキューグリル",   en: "BBQ grill",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1.5 6a5 5 0 01-9 0L6 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6M9 20h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5c0-1 .5-2 1-2.5M12 5c0-1 .5-2 1-2.5M16 5c0-1 .5-2 1-2.5" /></svg> },
      { id: "kitchen", zh: "允许吸烟",     ja: "喫煙OK",   en: "smoking allowed",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 15h14v3H2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 15h2a2 2 0 002-2v-1a2 2 0 00-2-2h-1a2 2 0 01-2-2V7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 15h2v3h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 7c0-1 .8-3 2-3" />
      </svg> },
    ],
  },
];


function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
      <span className="text-sm text-gray-900">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center text-lg font-light transition-colors",
            value === 0
              ? "border-gray-200 text-gray-300 cursor-default"
              : "border-gray-300 text-gray-700 hover:border-gray-500 cursor-pointer"
          )}
        >
          −
        </button>
        <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
          {value === 0 ? "–" : `${value}+`}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-light text-gray-700 hover:border-gray-500 transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function FilterDrawer({ open, onClose, value, onChange, locale = "zh" }: FilterDrawerProps) {
  const [draft, setDraft] = useState<FilterState>(value);

  const set = (patch: Partial<FilterState>) => setDraft(d => ({ ...d, ...patch }));

  const toggleAmenity = (id: string) => {
    const list = draft.amenities ?? [];
    set({ amenities: list.includes(id) ? list.filter(x => x !== id) : [...list, id] });
  };

  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const clearAll = () => setDraft({ minPrice: 0, maxPrice: 0, amenities: [], bedrooms: 0, bathrooms: 0, beds: 0 });

  const apply = () => { onChange(draft); onClose(); };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[800]"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] w-[520px] max-h-[82vh] bg-white rounded-3xl shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {L(locale, "筛选条件", "絞り込み", "Filters")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Rental type */}
          <div>
            <h4 className="flex justify-start text-sm font-semibold text-gray-900 mb-3">
              {L(locale, "租赁类型", "タイプ", "Type")}
            </h4>
            <div className="flex border border-gray-200 rounded-xl p-1 gap-1 bg-gray-50">
              {([undefined, "daily", "monthly"] as const).map((t) => {
                const labels = { undefined: L(locale, "全部", "すべて", "All"), daily: L(locale, "日租", "デイリー", "Daily"), monthly: L(locale, "月租", "マンスリー", "Monthly") };
                const active = draft.type === t;
                return (
                  <button
                    key={String(t)}
                    onClick={() => {
                      if (t === undefined) {
                        const { type: _t, ...rest } = draft;
                        void _t;
                        setDraft(rest);
                      } else {
                        set({ type: t });
                      }
                    }}
                    className={cn(
                      "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                      active
                        ? "bg-white text-gray-900 shadow-sm border border-gray-200 font-semibold"
                        : "text-gray-400 hover:text-gray-700"
                    )}
                  >
                    {labels[String(t) as keyof typeof labels]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h4 className="flex justify-start text-sm font-semibold text-gray-900 mb-3">
              {L(locale, "价格范围", "価格帯", "Price range")}
            </h4>
            <div className="flex gap-3 mb-3">
              {([["minPrice", L(locale, "最低", "最低", "Min")] as const, ["maxPrice", L(locale, "最高", "最高", "Max")] as const]).map(
                ([key, label]) => (
                  <div key={key} className="flex-1">
                    <p className="text-[10px] font-semibold text-gray-400 mb-1.5 tracking-widest uppercase">{label}</p>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-2 bg-gray-50">
                      <span className="text-sm text-gray-400">¥</span>
                      <input
                        type="number"
                        value={draft[key] ?? ""}
                        onChange={e => set({ [key]: Number(e.target.value) })}
                        className="border-none outline-none text-sm text-gray-900 bg-transparent flex-1 min-w-0"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRICE_PRESETS.map(([min, max], i) => {
                const active = draft.minPrice === min && draft.maxPrice === max;
                return (
                  <button
                    key={i}
                    onClick={() => set({ minPrice: min, maxPrice: max })}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                      active
                        ? "bg-primary text-white border-transparent"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    )}
                  >
                    {PRICE_LABELS(locale)[i]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rooms & Beds */}
          <div>
            <h4 className="flex justify-start text-sm font-semibold text-gray-900 mb-1">
              {L(locale, "卧室/床位", "寝室/ベッド", "Rooms & Beds")}
            </h4>
            <Stepper
              label={L(locale, "卧室", "寝室", "Bedrooms")}
              value={draft.bedrooms ?? 0}
              onChange={v => set({ bedrooms: v })}
            />
            <Stepper
              label={L(locale, "床位", "ベッド", "Beds")}
              value={draft.beds ?? 0}
              onChange={v => set({ beds: v })}
            />
            <Stepper
              label={L(locale, "卫生间", "バスルーム", "Bathrooms")}
              value={draft.bathrooms ?? 0}
              onChange={v => set({ bathrooms: v })}
            />
          </div>

          {/* Amenities */}
          {/* <div>
            <h4 className="flex justify-start text-sm font-semibold text-gray-900 mb-3">
              {L(locale, "便利设施", "設備", "Amenities")}
            </h4>
            {AMENITY_GROUPS.map(grp => (
              <div key={grp.group.en} className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2.5">
                  {grp.group[locale] ?? grp.group.en}
                </p>
                <div className="flex flex-wrap gap-2">
                  {grp.items.map(a => {
                    const active = (draft.amenities ?? []).includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAmenity(a.id)}
                        className={cn(
                          "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm border transition-all",
                          active
                            ? "bg-gray-900 text-white border-transparent font-medium"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        )}
                      >
                        {a.icon}
                        {a[locale] ?? a.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div> */}

          {/* Amenities */}
          <div>
            <h4 className="flex justify-start text-sm font-semibold text-gray-900 mb-3">
              {L(locale, "便利设施", "設備", "Amenities")}
            </h4>
            {AMENITY_GROUPS.map((grp, grpIndex) => {
              // 收起时只显示第一组
              if (!showAllAmenities && grpIndex > 0) return null;
              
              const items = !showAllAmenities && grpIndex === 0
                ? grp.items.slice(0, 6)  // 第一组最多显示6个
                : grp.items;

              return (
                <div key={grp.group.en} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2.5 text-left">
                    {grp.group[locale] ?? grp.group.en}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(a => {
                      const active = (draft.amenities ?? []).includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleAmenity(a.id)}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm border transition-all",
                            active
                               ? "bg-white text-gray-800 border-gray-800 border-[1.5px]"
                               : "bg-white text-gray-700 border-gray-200 border-[1.5px] border-gray-200 hover:border-gray-400"
                          )}
                        >
                          {a.icon}
                          {a[locale] ?? a.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* 展开/收起按钮 */}
            <button
              onClick={() => setShowAllAmenities(v => !v)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 underline underline-offset-2 mt-1 hover:text-gray-600 transition-colors"
            >
              {showAllAmenities
                ? L(locale, "收起", "閉じる", "Show less")
                : L(locale, "显示更多", "もっと見る", "Show more")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className={cn("w-3.5 h-3.5 transition-transform", showAllAmenities && "rotate-180")}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 flex items-center gap-3 bg-white flex-shrink-0">
          <button
            onClick={clearAll}
            className="text-sm text-gray-400 underline hover:text-gray-600 transition-colors py-2"
          >
            {L(locale, "清除全部", "すべてクリア", "Clear all")}
          </button>
          <div className="flex-1" />
          <Btn onClick={apply} size="lg">
            {L(locale, "显示房源", "物件を表示", "Show listings")}
          </Btn>
        </div>
      </div>
    </>
  );
}
