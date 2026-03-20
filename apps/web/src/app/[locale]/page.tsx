import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { createUmestayServerClient, getFeaturedProperties } from "@umestay/db";
import type { PropertySummaryRow } from "@umestay/db";
import { PropertyCard } from "@umestay/ui/composite";
import { HeroSection } from "@/components/home/HeroSection";
import { AreaQuickLinks } from "@/components/home/AreaQuickLinks";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("hero_title"),
    description: t("hero_subtitle"),
  };
}

async function makeServerClient() {
  const cookieStore = await cookies();
  return createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const client = await makeServerClient();
  const { data: featured } = await getFeaturedProperties(client, 6);

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection locale={locale} />

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t("featured")}</h2>
          <Link
            href={`/${locale}/properties`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {tCommon("view_all")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featured ?? []).map((p: PropertySummaryRow) => (
            <PropertyCard
              key={p.id}
              property={p}
              locale={locale as "zh" | "ja" | "en"}
              href={`/${locale}/properties/${p.id}`}
            />
          ))}
        </div>
      </section>

      {/* Monthly Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-800 to-primary-600 text-white px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">{t("monthly_banner_title")}</h3>
            <p className="text-primary-100">{t("monthly_banner_sub")}</p>
          </div>
          <Link
            href={`/${locale}/properties?type=monthly`}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            {t("monthly_banner_cta")}
          </Link>
        </div>
      </section>

      <AreaQuickLinks locale={locale} />
    </main>
  );
}
