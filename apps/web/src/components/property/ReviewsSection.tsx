import type { ReviewRow } from "@umestay/db";
import { Stars } from "@umestay/ui";

interface ReviewsSectionProps {
  reviews: ReviewRow[];
  rating: number;
  reviewCount: number;
  locale: "zh" | "ja" | "en";
}

const LABEL = {
  zh: { title: "评价", no_reviews: "暂无评价" },
  ja: { title: "クチコミ", no_reviews: "まだクチコミがありません" },
  en: { title: "Reviews", no_reviews: "No reviews yet" },
};

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : "en-US",
    { year: "numeric", month: "long" }
  );
}

export function ReviewsSection({ reviews, rating, reviewCount, locale }: ReviewsSectionProps) {
  const L = LABEL[locale];

  return (
    <section className="py-8 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-bold text-gray-900">{L.title}</h2>
        {reviewCount > 0 && (
          <Stars rating={rating} count={reviewCount} size="md" />
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">{L.no_reviews}</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <Stars rating={r.rating_overall} size="sm" />
                <span className="text-xs text-gray-400">{formatDate(r.created_at, locale)}</span>
              </div>
              {r.comment && (
                <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
              )}
              {r.host_reply && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    {locale === "zh" ? "房东回复" : locale === "ja" ? "ホストの返信" : "Host reply"}
                  </p>
                  <p className="text-sm text-gray-600">{r.host_reply}</p>
                </div>
              )}
              {/* Sub-ratings */}
              {(r.rating_clean || r.rating_location || r.rating_value) && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {r.rating_clean && (
                    <span className="text-xs text-gray-500">
                      {locale === "zh" ? "清洁" : locale === "ja" ? "清潔" : "Clean"}: {r.rating_clean}
                    </span>
                  )}
                  {r.rating_location && (
                    <span className="text-xs text-gray-500">
                      {locale === "zh" ? "位置" : locale === "ja" ? "立地" : "Location"}: {r.rating_location}
                    </span>
                  )}
                  {r.rating_value && (
                    <span className="text-xs text-gray-500">
                      {locale === "zh" ? "性价比" : locale === "ja" ? "コスパ" : "Value"}: {r.rating_value}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
