import type { AmenityRow } from "@umestay/db";

interface AmenitiesSectionProps {
  amenities: AmenityRow[];
  locale: "zh" | "ja" | "en";
}

const LABEL = {
  zh: "设施与服务",
  ja: "設備・アメニティ",
  en: "Amenities",
};

export function AmenitiesSection({ amenities, locale }: AmenitiesSectionProps) {
  if (amenities.length === 0) return null;

  const grouped = amenities.reduce<Record<string, AmenityRow[]>>((acc, a) => {
    const key = a.category ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <section className="py-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-5">{LABEL[locale]}</h2>
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              {category}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {items.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
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
