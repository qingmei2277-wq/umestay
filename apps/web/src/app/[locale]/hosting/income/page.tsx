import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { PayoutTable } from "@/components/hosting/PayoutTable";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("income_title") };
}

export default async function HostingIncomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });

  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: payouts } = await supabase
    .from("host_payouts")
    .select("id, amount, status, created_at, booking_id, notes")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  const pendingAmount = (payouts ?? [])
    .filter((p: Record<string, unknown>) => p.status === "pending")
    .reduce((sum: number, p: Record<string, unknown>) => sum + ((p.amount as number) ?? 0), 0);

  const totalPaid = (payouts ?? [])
    .filter((p: Record<string, unknown>) => p.status === "paid")
    .reduce((sum: number, p: Record<string, unknown>) => sum + ((p.amount as number) ?? 0), 0);

  const labels = {
    statusPending: t("income_status_pending"),
    statusPaid: t("income_status_paid"),
    statusProcessing: t("income_status_processing"),
    noPayouts: t("no_payouts"),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("income_title")}</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {t("income_pending")}
          </p>
          <p className="text-2xl font-bold text-yellow-600">
            ¥{pendingAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {t("income_total_paid")}
          </p>
          <p className="text-2xl font-bold text-green-600">
            ¥{totalPaid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Notice */}
      <p className="text-xs text-gray-400 mb-6">{t("income_payout_notice")}</p>

      <PayoutTable payouts={payouts ?? []} labels={labels} />
    </>
  );
}
