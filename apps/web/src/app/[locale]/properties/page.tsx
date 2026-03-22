import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { createUmestayServerClient, getProperties } from "@umestay/db";
import type { PropertySummaryRow } from "@umestay/db";
import { PropertyCard } from "@umestay/ui/composite";
import { PropertiesToolbar } from "@/components/properties/PropertiesToolbar";
import { Pagination } from "@/components/properties/Pagination";

type SearchParams = {
  q?: string;
  type?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return { title: t("location_placeholder") };
}

const PAGE_SIZE = 20;

export default async function PropertiesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "search" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const cookieStore = await cookies();
  const client = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const currentPage = Number(sp.page ?? 1);

  const { data: properties, count, error } = await getProperties(client, {
    ...(sp.type === "daily" || sp.type === "monthly"
      ? { type: sp.type }
      : {}),
    ...(sp.minPrice ? { minPrice: Number(sp.minPrice) } : {}),
    ...(sp.maxPrice ? { maxPrice: Number(sp.maxPrice) } : {}),
    ...(sp.guests ? { guests: Number(sp.guests) } : {}),
    ...(sp.sort === "price_asc" ||
      sp.sort === "price_desc" ||
      sp.sort === "rating" ||
      sp.sort === "newest"
      ? { sort: sp.sort }
      : {}),
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const items = (properties ?? []) as PropertySummaryRow[];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar: sort + filter (client) */}
        <PropertiesToolbar
          locale={locale as "zh" | "ja" | "en"}
          count={count ?? 0}
          searchParams={sp}
        />

        {/* Grid */}
        {error ? (
          <p className="text-center text-red-500 py-16">{tCommon("error")}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t("no_results")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {items.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                locale={locale as "zh" | "ja" | "en"}
                href={`/${locale}/properties/${p.id}`}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={sp}
            />
          </div>
        )}
      </div>
    </main>
  );
}
