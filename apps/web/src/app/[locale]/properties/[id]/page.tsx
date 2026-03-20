import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import {
  createUmestayServerClient,
  getPropertyById,
  getPropertyAmenities,
  getPropertyReviews,
  getPropertyImages,
  getBlockedDates,
} from "@umestay/db";
import type { AmenityRow, ReviewRow } from "@umestay/db";
import { Stars, TypeTag } from "@umestay/ui";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { AmenitiesSection } from "@/components/property/AmenitiesSection";
import { ReviewsSection } from "@/components/property/ReviewsSection";
import { BookingCard } from "@/components/property/BookingCard";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string }>;
}

async function makeServerClient() {
  const cookieStore = await cookies();
  return createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const client = await makeServerClient();
  const { data: property } = await getPropertyById(client, id);
  if (!property) return { title: "Property not found" };
  const locale = rawLocale as "zh" | "ja" | "en";
  const title =
    (locale === "ja" ? property.title_ja : locale === "en" ? property.title_en : property.title_zh) ??
    property.title_zh;
  return { title };
}

export default async function PropertyDetailPage({ params, searchParams }: PageProps) {
  const { locale, id } = await params;
  const sp = await searchParams;
  const lang = locale as "zh" | "ja" | "en";

  const client = await makeServerClient();

  const [
    { data: property },
    { data: rawAmenities },
    { data: rawReviews },
    { data: rawImages },
    { data: rawBlocked },
  ] = await Promise.all([
    getPropertyById(client, id),
    getPropertyAmenities(client, id),
    getPropertyReviews(client, id, 10),
    getPropertyImages(client, id),
    getBlockedDates(client, id),
  ]);

  if (!property) notFound();

  const amenities = (rawAmenities ?? []) as AmenityRow[];
  const reviews   = (rawReviews ?? []) as ReviewRow[];
  const images    = (rawImages ?? []) as { id: string; url: string; sort_order: number; is_cover: boolean; property_id: string }[];
  const blocked   = (rawBlocked ?? []).map((b: { blocked_date: string }) => b.blocked_date);

  const title =
    (lang === "ja" ? property.title_ja : lang === "en" ? property.title_en : property.title_zh) ??
    property.title_zh;

  const description =
    (lang === "ja"
      ? property.description_ja
      : lang === "en"
      ? property.description_en
      : property.description_zh) ?? property.description_zh ?? "";

  const LABEL = {
    zh: { about: "房源介绍", location: "位置", rules: "入住须知", cancel: "取消政策", station: "分钟步行", checkinTime: "入住时间", checkoutTime: "退房时间" },
    ja: { about: "物件紹介", location: "アクセス", rules: "ハウスルール", cancel: "キャンセルポリシー", station: "分徒歩", checkinTime: "チェックイン", checkoutTime: "チェックアウト" },
    en: { about: "About this place", location: "Location", rules: "House rules", cancel: "Cancellation", station: "min walk", checkinTime: "Check-in", checkoutTime: "Check-out" },
  }[lang];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Gallery */}
        <PropertyGallery images={images} title={title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-0">
            {/* Header */}
            <div className="pb-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TypeTag type={property.type} locale={lang} />
                    {property.license_number && (
                      <span className="text-xs text-gray-400">#{property.license_number}</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">{title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {[property.city, property.prefecture].filter(Boolean).join(", ")}
                    {property.nearest_station && (
                      <> · {property.nearest_station} {property.station_walk_min}{LABEL.station}</>
                    )}
                  </p>
                </div>
                {(property.rating_avg ?? 0) > 0 && (
                  <Stars rating={property.rating_avg} count={property.review_count} size="md" />
                )}
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
                <span>{property.max_guests} {lang === "zh" ? "位房客" : lang === "ja" ? "名" : "guests"}</span>
                {property.area_sqm && <span>{property.area_sqm}㎡</span>}
                {property.checkin_time && (
                  <span>{LABEL.checkinTime}: {property.checkin_time}</span>
                )}
                {property.checkout_time && (
                  <span>{LABEL.checkoutTime}: {property.checkout_time}</span>
                )}
              </div>
            </div>

            {/* Description */}
            {description && (
              <section className="py-8 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{LABEL.about}</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
              </section>
            )}

            {/* Amenities */}
            <AmenitiesSection amenities={amenities} locale={lang} />

            {/* House rules */}
            {property.house_rules && (
              <section className="py-8 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{LABEL.rules}</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.house_rules}
                </p>
              </section>
            )}

            {/* Cancellation */}
            {property.cancellation_policy && (
              <section className="py-8 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{LABEL.cancel}</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {property.cancellation_policy}
                </p>
              </section>
            )}

            {/* Reviews */}
            <ReviewsSection
              reviews={reviews}
              rating={property.rating_avg}
              reviewCount={property.review_count}
              locale={lang}
            />
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1">
            <BookingCard
              property={property}
              locale={lang}
              blockedDates={blocked}
              {...(sp.checkin ? { initialCheckin: sp.checkin } : {})}
              {...(sp.checkout ? { initialCheckout: sp.checkout } : {})}
              {...(sp.guests ? { initialGuests: Number(sp.guests) } : {})}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
