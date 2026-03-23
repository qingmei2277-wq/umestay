import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createUmestayServerClient } from "@umestay/db";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("overview_title") };
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/account`);

  const [profileRes, bookingCountRes, favCountRes] = await Promise.all([
    supabase.from("profiles").select("name, avatar_url").eq("user_id", user.id).single(),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("favorites").select("property_id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const profile = profileRes.data;
  const bookingCount = bookingCountRes.count ?? 0;
  const favCount = favCountRes.count ?? 0;

  const quickLinks = [
    {
      href: `/${locale}/account/profile`,
      icon: "👤",
      label: t("profile_title"),
    },
    {
      href: `/${locale}/bookings`,
      icon: "📋",
      label: t("my_bookings"),
    },
    {
      href: `/${locale}/favorites`,
      icon: "❤️",
      label: t("my_favorites"),
    },
    {
      href: `/${locale}/messages`,
      icon: "💬",
      label: t("my_messages"),
    },
    {
      href: `/${locale}/account/verification`,
      icon: "🪪",
      label: t("verification_title"),
    },
    {
      href: `/${locale}/account/settings`,
      icon: "⚙️",
      label: t("settings_title"),
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* 用户信息 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-100 border border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.name ?? ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary text-2xl font-semibold">
              {(profile?.name ?? user.email ?? "U")[0].toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {profile?.name ?? user.email ?? "—"}
          </h1>
          <p className="text-sm text-gray-500">{user.email ?? user.phone}</p>
        </div>
      </div>

      {/* 统计数字 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{bookingCount}</div>
          <div className="text-xs text-gray-500 mt-1">{t("bookings_count", { n: bookingCount })}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{favCount}</div>
          <div className="text-xs text-gray-500 mt-1">{t("favorites_count", { n: favCount })}</div>
        </div>
      </div>

      {/* 快捷入口 */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {t("quick_links")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:bg-primary-50 transition-colors text-center"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
