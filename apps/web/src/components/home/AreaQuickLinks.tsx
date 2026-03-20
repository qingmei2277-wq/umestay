import Link from "next/link";
import { useTranslations } from "next-intl";

interface AreaQuickLinksProps {
  locale: string;
}

const AREAS = [
  { key: "area_shinjuku", q: "新宿区" },
  { key: "area_shibuya",  q: "渋谷区" },
  { key: "area_ikebukuro", q: "豊島区" },
  { key: "area_ebisu",    q: "恵比寿" },
  { key: "area_ginza",    q: "銀座" },
  { key: "area_akihabara", q: "秋葉原" },
] as const;

export function AreaQuickLinks({ locale }: AreaQuickLinksProps) {
  const t = useTranslations("home");

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5">{t("areas")}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {AREAS.map(({ key, q }) => (
          <Link
            key={key}
            href={`/${locale}/properties?q=${encodeURIComponent(q)}`}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:border-primary hover:shadow-card transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {t(key)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
