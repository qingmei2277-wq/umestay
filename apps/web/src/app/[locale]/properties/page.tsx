import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
};

export default function PropertiesPage() {
  const t = useTranslations("property");
  const tCommon = useTranslations("common");

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {/* TODO: dynamic city/area name */}
            Properties
          </h1>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {tCommon("filter")}
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className="rounded-full border border-primary bg-primary px-4 py-1.5 text-sm font-medium text-white"
          >
            {t("daily")}
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("monthly")}
          </button>
        </div>

        {/* Property grid — to be populated with real data */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <p className="col-span-full text-center text-gray-500 py-16">
            {tCommon("loading")}
          </p>
        </div>
      </div>
    </main>
  );
}
