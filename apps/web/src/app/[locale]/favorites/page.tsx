import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createUmestayServerClient, getPropertyById } from "@umestay/db";
import type { PropertySummaryRow } from "@umestay/db";
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favorites" });
  return { title: t("title") };
}

export default async function FavoritesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favorites" });

  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/favorites`);

  // 先获取所有收藏的 property_id
  const { data: favRows } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", user.id);

  const propertyIds = (favRows ?? []).map((f) => f.property_id as string);

  // 批量获取房源摘要
  let properties: PropertySummaryRow[] = [];
  if (propertyIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("v_properties_summary" as any) as any)
      .select("*")
      .in("id", propertyIds);
    properties = data ?? [];
  }

  const items = propertyIds
    .map((id) => ({
      property_id: id,
      property: properties.find((p) => p.id === id) ?? null,
    }))
    .filter((i): i is { property_id: string; property: PropertySummaryRow } => !!i.property);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        {items.length > 0 && (
          <span className="text-sm text-gray-500">{t("count", { n: items.length })}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">❤️</span>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{t("empty_title")}</h2>
          <p className="text-sm text-gray-500 mb-6">{t("empty_sub")}</p>
          <Link
            href={`/${locale}/properties`}
            className="bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            {t("browse_listings")}
          </Link>
        </div>
      ) : (
        <FavoritesGrid
          items={items}
          locale={locale as "zh" | "ja" | "en"}
        />
      )}
    </main>
  );
}
