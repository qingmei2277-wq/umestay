import type { AmenityRow } from "@umestay/db";

interface AmenitiesSectionProps {
  amenities: AmenityRow[];
  locale: "zh" | "ja" | "en";
}

const LABEL = {
  zh: "房源亮点与便利设施",
  ja: "設備・アメニティ",
  en: "Amenities & highlights",
};

// 分类名称映射（DB 存储的 category 值 → 各语言显示名，支持中英日）
const CATEGORY_LABELS: Record<string, { zh: string; ja: string; en: string }> = {
  // 新标准 key
  bathroom:           { zh: "卫生间",       ja: "バスルーム",              en: "Bathroom" },
  卫生间:              { zh: "卫生间",       ja: "バスルーム",              en: "Bathroom" },
  bedroom_laundry:    { zh: "卧室和洗衣房", ja: "寝室・ランドリー",        en: "Bedroom & laundry" },
  卧室和洗衣房:        { zh: "卧室和洗衣房", ja: "寝室・ランドリー",        en: "Bedroom & laundry" },
  entertainment:      { zh: "娱乐",         ja: "エンターテインメント",    en: "Entertainment" },
  娱乐:               { zh: "娱乐",         ja: "エンターテインメント",    en: "Entertainment" },
  climate:            { zh: "暖气和冷气",   ja: "冷暖房",                  en: "Heating & cooling" },
  暖气和冷气:          { zh: "暖气和冷气",   ja: "冷暖房",                  en: "Heating & cooling" },
  internet_office:    { zh: "互联网和办公", ja: "インターネット・オフィス", en: "Internet & office" },
  互联网和办公:        { zh: "互联网和办公", ja: "インターネット・オフィス", en: "Internet & office" },
  kitchen_dining:     { zh: "厨房及用餐",   ja: "キッチン・ダイニング",    en: "Kitchen & dining" },
  厨房及用餐:          { zh: "厨房及用餐",   ja: "キッチン・ダイニング",    en: "Kitchen & dining" },
  parking_facilities: { zh: "停车和设施",   ja: "駐車場・施設",            en: "Parking & facilities" },
  停车和设施:          { zh: "停车和设施",   ja: "駐車場・施設",            en: "Parking & facilities" },
  // DB 中常见的旧 key（大写英文）
  ROOM:               { zh: "房间设施",     ja: "部屋の設備",              en: "Room" },
  room:               { zh: "房间设施",     ja: "部屋の設備",              en: "Room" },
  KITCHEN:            { zh: "厨房及用餐",   ja: "キッチン・ダイニング",    en: "Kitchen & dining" },
  kitchen:            { zh: "厨房及用餐",   ja: "キッチン・ダイニング",    en: "Kitchen & dining" },
  LAUNDRY:            { zh: "卧室和洗衣房", ja: "寝室・ランドリー",        en: "Bedroom & laundry" },
  laundry:            { zh: "卧室和洗衣房", ja: "寝室・ランドリー",        en: "Bedroom & laundry" },
  BATHROOM:           { zh: "卫生间",       ja: "バスルーム",              en: "Bathroom" },
  ENTERTAINMENT:      { zh: "娱乐",         ja: "エンターテインメント",    en: "Entertainment" },
  CLIMATE:            { zh: "暖气和冷气",   ja: "冷暖房",                  en: "Heating & cooling" },
  PARKING:            { zh: "停车和设施",   ja: "駐車場・施設",            en: "Parking & facilities" },
  parking:            { zh: "停车和设施",   ja: "駐車場・施設",            en: "Parking & facilities" },
};

// 分类显示顺序
const CATEGORY_ORDER = [
  "bathroom", "卫生间",
  "bedroom_laundry", "卧室和洗衣房",
  "entertainment", "娱乐",
  "climate", "暖气和冷气",
  "internet_office", "互联网和办公",
  "kitchen_dining", "厨房及用餐",
  "parking_facilities", "停车和设施",
];

type SvgIcon = React.ReactElement<React.SVGProps<SVGSVGElement>>;

const cls = "w-5 h-5 flex-shrink-0";
const svgProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24" } as const;
const r = "round" as const;

// 设施图标映射（支持中英文 key）
const ICONS: Record<string, SvgIcon> = {
  // ── 卫生间 ─────────────────────────────────────────────
  bathtub: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M4 10h16v3a5 5 0 01-5 5H9a5 5 0 01-5-5v-3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M7 10V7a2 2 0 012-2h0a2 2 0 012 2v3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M7 18l-1 2.5M17 18l1 2.5" />
    </svg>
  ),
  浴缸: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M4 10h16v3a5 5 0 01-5 5H9a5 5 0 01-5-5v-3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M7 10V7a2 2 0 012-2h0a2 2 0 012 2v3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M7 18l-1 2.5M17 18l1 2.5" />
    </svg>
  ),
  hairdryer: (
    <svg viewBox="0 0 32 32" fill="currentColor" stroke="currentColor" strokeWidth={0.2} className={cls} aria-hidden="true">
      <path strokeLinecap={r} strokeLinejoin={r} d="M14 27v.2a4 4 0 0 1-3.8 3.8H4v-2h6.15a2 2 0 0 0 1.84-1.84L12 27zM10 1c.54 0 1.07.05 1.58.14l.38.07 17.45 3.65a2 2 0 0 1 1.58 1.79l.01.16v6.38a2 2 0 0 1-1.43 1.91l-.16.04-13.55 2.83 1.76 6.5A2 2 0 0 1 15.87 27l-.18.01h-3.93a2 2 0 0 1-1.88-1.32l-.05-.15-1.88-6.76A9 9 0 0 1 10 1zm5.7 24-1.8-6.62-1.81.38a9 9 0 0 1-1.67.23h-.33L11.76 25zM10 3a7 7 0 1 0 1.32 13.88l.33-.07L29 13.18V6.8L11.54 3.17A7.03 7.03 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  吹风机: (
    <svg viewBox="0 0 32 32" fill="currentColor" stroke="currentColor" strokeWidth={0.2} className={cls} aria-hidden="true">
      <path strokeLinecap={r} strokeLinejoin={r} d="M14 27v.2a4 4 0 0 1-3.8 3.8H4v-2h6.15a2 2 0 0 0 1.84-1.84L12 27zM10 1c.54 0 1.07.05 1.58.14l.38.07 17.45 3.65a2 2 0 0 1 1.58 1.79l.01.16v6.38a2 2 0 0 1-1.43 1.91l-.16.04-13.55 2.83 1.76 6.5A2 2 0 0 1 15.87 27l-.18.01h-3.93a2 2 0 0 1-1.88-1.32l-.05-.15-1.88-6.76A9 9 0 0 1 10 1zm5.7 24-1.8-6.62-1.81.38a9 9 0 0 1-1.67.23h-.33L11.76 25zM10 3a7 7 0 1 0 1.32 13.88l.33-.07L29 13.18V6.8L11.54 3.17A7.03 7.03 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  cleaning_supplies: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9.5 3h5l1 4H8.5l1-4z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 7v13a1 1 0 001 1h6a1 1 0 001-1V7" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 11h8" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 3V2M14 3V2" />
    </svg>
  ),
  清洁用品: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9.5 3h5l1 4H8.5l1-4z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 7v13a1 1 0 001 1h6a1 1 0 001-1V7" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 11h8" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 3V2M14 3V2" />
    </svg>
  ),
  shampoo: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6v3l2 3v11a1 1 0 01-1 1H8a1 1 0 01-1-1V9l2-3V3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 13h4" />
    </svg>
  ),
  洗发水: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6v3l2 3v11a1 1 0 01-1 1H8a1 1 0 01-1-1V9l2-3V3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 13h4" />
    </svg>
  ),
  conditioner: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6v3l2 3v11a1 1 0 01-1 1H8a1 1 0 01-1-1V9l2-3V3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 13h4M10 16h4" />
    </svg>
  ),
  护发素: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6v3l2 3v11a1 1 0 01-1 1H8a1 1 0 01-1-1V9l2-3V3z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 3h6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M10 13h4M10 16h4" />
    </svg>
  ),
  body_soap: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="9" width="14" height="11" rx="3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 9V7a4 4 0 018 0v2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 14.5h6" />
    </svg>
  ),
  沐浴皂: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="9" width="14" height="11" rx="3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 9V7a4 4 0 018 0v2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 14.5h6" />
    </svg>
  ),
  hot_water: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 3c0 0-5 5.5-5 10a5 5 0 0010 0c0-4.5-5-10-5-10z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9.5 4.5c0 0 .8 1.5.8 3" />
    </svg>
  ),
  热水: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 3c0 0-5 5.5-5 10a5 5 0 0010 0c0-4.5-5-10-5-10z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9.5 4.5c0 0 .8 1.5.8 3" />
    </svg>
  ),

  // ── 卧室和洗衣房 ────────────────────────────────────────
  washer: (
    <svg {...svgProps} className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
  洗衣机: (
    <svg {...svgProps} className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
  hangers: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 4a2 2 0 012 2v1.5L21 15H3l7-7.5V6a2 2 0 012-2z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 15v1a2 2 0 002 2h14a2 2 0 002-2v-1" />
    </svg>
  ),
  衣架: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 4a2 2 0 012 2v1.5L21 15H3l7-7.5V6a2 2 0 012-2z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 15v1a2 2 0 002 2h14a2 2 0 002-2v-1" />
    </svg>
  ),
  drying_rack: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 9l9-6 9 6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 9v10M21 9v10" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 19h18" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 9v10M16 9v10" />
    </svg>
  ),
  晾衣架: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 9l9-6 9 6" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 9v10M21 9v10" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M3 19h18" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 9v10M16 9v10" />
    </svg>
  ),
  wardrobe: (
    <svg {...svgProps} className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 3v18" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  "衣柜 / 衣橱": (
    <svg {...svgProps} className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 3v18" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  衣柜: (
    <svg {...svgProps} className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 3v18" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),

  // ── 娱乐 ────────────────────────────────────────────────
  tv: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875C21 4.254 20.496 3.75 19.875 3.75H4.125C3.504 3.75 3 4.254 3 4.875v11.25c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  电视: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875C21 4.254 20.496 3.75 19.875 3.75H4.125C3.504 3.75 3 4.254 3 4.875v11.25c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),

  // ── 暖气和冷气 ──────────────────────────────────────────
  ac: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={cls} strokeLinecap={r} strokeLinejoin={r}>
      <path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/>
      <path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/>
      <path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/>
      <path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/>
      <path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/>
      <path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>
    </svg>
  ),
  空调: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={cls} strokeLinecap={r} strokeLinejoin={r}>
      <path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/>
      <path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/>
      <path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/>
      <path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/>
      <path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/>
      <path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>
    </svg>
  ),
  heating: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  heat: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  暖气: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),

  // ── 互联网和办公 ─────────────────────────────────────────
  wifi: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" />
    </svg>
  ),
  无线网络: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" />
    </svg>
  ),

  // ── 厨房及用餐 ──────────────────────────────────────────
  kitchen: (
    <svg {...svgProps} className={cls} strokeLinecap={r} strokeLinejoin={r}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  厨房: (
    <svg {...svgProps} className={cls} strokeLinecap={r} strokeLinejoin={r}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  fridge: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 10h14" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 6v2M9 14v3" />
    </svg>
  ),
  冰箱: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 10h14" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 6v2M9 14v3" />
    </svg>
  ),
  microwave: (
    <svg {...svgProps} className={cls}>
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <rect x="4" y="9" width="11" height="9" rx="1" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M18 10v5" />
    </svg>
  ),
  微波炉: (
    <svg {...svgProps} className={cls}>
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <rect x="4" y="9" width="11" height="9" rx="1" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M18 10v5" />
    </svg>
  ),
  dishes: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M6 2v6c0 1.1.9 2 2 2h0a2 2 0 002-2V2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 10v12" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M18 2v20M18 8a4 4 0 000-6" />
    </svg>
  ),
  "盘子和餐具": (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M6 2v6c0 1.1.9 2 2 2h0a2 2 0 002-2V2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 10v12" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M18 2v20M18 8a4 4 0 000-6" />
    </svg>
  ),
  stove: (
    <svg {...svgProps} className={cls}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <circle cx="16" cy="12" r="2.5" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 5V3M16 5V3" />
    </svg>
  ),
  炉灶: (
    <svg {...svgProps} className={cls}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <circle cx="16" cy="12" r="2.5" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M8 5V3M16 5V3" />
    </svg>
  ),
  kettle: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 8h14l-1.5 9a2 2 0 01-1.98 1.7H8.48A2 2 0 016.5 17L5 8z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M19 10h2a1 1 0 010 2h-2" />
    </svg>
  ),
  热水壶: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 8h14l-1.5 9a2 2 0 01-1.98 1.7H8.48A2 2 0 016.5 17L5 8z" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M19 10h2a1 1 0 010 2h-2" />
    </svg>
  ),

  // ── 停车和设施 ──────────────────────────────────────────
  parking: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 17V7h4a3 3 0 010 6H9" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  停车: (
    <svg {...svgProps} className={cls}>
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 17V7h4a3 3 0 010 6H9" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  elevator: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 9l3-3 3 3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 15l3 3 3-3" />
    </svg>
  ),
  电梯: (
    <svg {...svgProps} className={cls}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 9l3-3 3 3" />
      <path strokeLinecap={r} strokeLinejoin={r} d="M9 15l3 3 3-3" />
    </svg>
  ),
};

// ── 日文名别名（直接引用已定义的图标）────────────────────────
// 在 ICONS 对象定义完成后追加，避免前向引用
const JA_ALIASES: Record<string, string> = {
  // 卫生间
  "バスタブ": "bathtub",
  "浴槽": "bathtub",
  "ヘアドライヤー": "hairdryer",
  "ドライヤー": "hairdryer",
  "清掃用品": "cleaning_supplies",
  "シャンプー": "shampoo",
  "コンディショナー": "conditioner",
  "リンス": "conditioner",
  "ボディソープ": "body_soap",
  "石鹸": "body_soap",
  "お湯": "hot_water",
  "温水": "hot_water",
  // 卧室
  "洗濯機": "washer",
  "ハンガー": "hangers",
  "物干しラック": "drying_rack",
  "クローゼット": "wardrobe",
  "洋服ダンス": "wardrobe",
  // 娱乐
  "テレビ": "tv",
  "TV": "tv",
  // 暖气冷气
  "エアコン": "ac",
  "暖房": "heating",
  "ヒーター": "heating",
  // 网络
  "Wi-Fi": "wifi",
  "WiFi": "wifi",
  "無線LAN": "wifi",
  // 厨房
  "キッチン": "kitchen",
  "フルキッチン": "kitchen",
  "冷蔵庫": "fridge",
  "電子レンジ": "microwave",
  "食器": "dishes",
  "コンロ": "stove",
  "ケトル": "kettle",
  "電気ケトル": "kettle",
  // 停车设施
  "駐車場": "parking",
  "エレベーター": "elevator",
};

// 默认图标（未知设施）
const DefaultIcon = (
  <svg {...svgProps} className={cls}>
    <path strokeLinecap={r} strokeLinejoin={r} d="M5 13l4 4L19 7" />
  </svg>
);

function getIcon(name: string): SvgIcon {
  const direct = ICONS[name] ?? ICONS[name.toLowerCase()];
  if (direct) return direct as SvgIcon;
  const aliasKey = JA_ALIASES[name] ?? JA_ALIASES[name.trim()];
  if (aliasKey) return (ICONS[aliasKey] ?? DefaultIcon) as SvgIcon;
  return DefaultIcon as SvgIcon;
}

function getCategoryLabel(category: string, locale: "zh" | "ja" | "en"): string {
  const entry = CATEGORY_LABELS[category] ?? CATEGORY_LABELS[category.toLowerCase()];
  if (entry) return entry[locale];
  // fallback: 首字母大写
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function AmenitiesSection({ amenities, locale }: AmenitiesSectionProps) {
  if (amenities.length === 0) return null;

  // 按指定顺序分组
  const grouped = amenities.reduce<Record<string, AmenityRow[]>>((acc, a) => {
    const key = a.category ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // 对分组排序：按预定义顺序，未知分类放最后
  const orderedKeys = [
    ...CATEGORY_ORDER.filter((k) => grouped[k]),
    ...Object.keys(grouped).filter((k) => !CATEGORY_ORDER.includes(k)),
  ];
  // 去重（因为 CATEGORY_ORDER 中 zh/en 两种 key 都列了）
  const uniqueKeys = [...new Set(orderedKeys)];

  return (
    <section className="py-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{LABEL[locale]}</h2>
      <div className="space-y-7">
        {uniqueKeys.map((category) => (
          <div key={category}>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">
              {getCategoryLabel(category, locale)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
              {grouped[category]?.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="text-gray-700">{getIcon(a.name)}</span>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
