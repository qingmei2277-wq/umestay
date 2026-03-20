"use client";

import { useState } from "react";
import { cn } from "../utils/cn";
import { Btn } from "../atoms/Btn";

type Locale = "zh" | "ja" | "en";

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
      { id: "wifi",    zh: "无线网络", ja: "Wi-Fi",      en: "WiFi"      },
      { id: "ac",      zh: "空调",     ja: "エアコン",   en: "A/C"       },
      { id: "parking", zh: "免费停车", ja: "駐車場",     en: "Parking"   },
      { id: "washer",  zh: "洗衣机",   ja: "洗濯機",     en: "Washer"    },
      { id: "dryer",   zh: "烘干机",   ja: "乾燥機",     en: "Dryer"     },
      { id: "desk",    zh: "工作区",   ja: "ワーク",     en: "Workspace" },
    ],
  },
  {
    group: { zh: "必备", ja: "必須", en: "Essentials" },
    items: [
      { id: "kitchen", zh: "厨房",     ja: "キッチン",   en: "Kitchen" },
      { id: "heat",    zh: "暖气",     ja: "暖房",       en: "Heating" },
      { id: "tv",      zh: "电视",     ja: "テレビ",     en: "TV"      },
      { id: "iron",    zh: "熨斗",     ja: "アイロン",   en: "Iron"    },
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

  const clearAll = () => setDraft({ minPrice: 0, maxPrice: 200000, amenities: [], bedrooms: 0, bathrooms: 0, beds: 0 });

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
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
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
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
                          "px-3.5 py-1.5 rounded-full text-sm border transition-all",
                          active
                            ? "bg-gray-900 text-white border-transparent font-medium"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        )}
                      >
                        {a[locale] ?? a.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
