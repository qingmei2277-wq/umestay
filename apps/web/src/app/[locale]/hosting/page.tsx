import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createUmestayServerClient } from "@umestay/db";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const ALLOWED_ROLES = ["host", "co_host", "operator", "super_admin"];

export default async function HostingOverviewPage({ params }: PageProps) {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || !ALLOWED_ROLES.includes(profile.role as string)) {
    redirect(`/${locale}`);
  }

  // KPI 1: Active properties owned by user
  const { count: activeRooms } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("status", "active");

  // KPI 2: Pending bookings for host's properties
  let pendingBookings = 0;
  const { data: propertyRows } = await supabase
    .from("properties")
    .select("id")
    .eq("owner_id", user.id);

  const propertyIds = (propertyRows ?? []).map((p: Record<string, unknown>) => p.id as string);

  if (propertyIds.length > 0) {
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_payment")
      .in("property_id", propertyIds);
    pendingBookings = count ?? 0;
  }

  // KPI 3: Pending payout sum
  const { data: payoutRows } = await supabase
    .from("host_payouts")
    .select("amount")
    .eq("host_id", user.id)
    .eq("status", "pending");

  const pendingPayout = (payoutRows ?? []).reduce(
    (sum: number, row: Record<string, unknown>) => sum + (Number(row.amount) || 0),
    0
  );

  const quickLinks = [
    {
      href: `/${locale}/hosting/rooms`,
      label: t("nav_rooms"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    },
    {
      href: `/${locale}/hosting/calendar`,
      label: t("nav_calendar"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      href: `/${locale}/hosting/bookings`,
      label: t("nav_bookings"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    },
    {
      href: `/${locale}/hosting/income`,
      label: t("nav_income"),
      icon: (
        <svg className="w-6 h-6 ucide lucide-wallet-cards-icon lucide-wallet-cards" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"/></svg>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("overview_title")}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">{t("kpi_active_rooms")}</p>
          <p className="text-3xl font-bold text-gray-900">{activeRooms ?? 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">{t("kpi_pending_bookings")}</p>
          <p className="text-3xl font-bold text-gray-900">{pendingBookings}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">{t("kpi_pending_payout")}</p>
          <p className="text-3xl font-bold text-gray-900">
            ¥{pendingPayout.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            <span className="text-gray-700">{icon}</span>
            <span className="text-sm font-medium text-gray-800">{label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
