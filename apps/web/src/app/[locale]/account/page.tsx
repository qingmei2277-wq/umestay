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

const quickLinkIcons: Record<string, React.ReactNode> = {
  profile: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  bookings: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  favorites: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  messages: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11h.01M16 11h.01M8 11h.01" />
    </svg>
  ),
  verification: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

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
    { href: `/${locale}/account/profile`,       iconKey: "profile",       label: t("profile_title") },
    { href: `/${locale}/bookings`,               iconKey: "bookings",      label: t("my_bookings") },
    { href: `/${locale}/favorites`,              iconKey: "favorites",     label: t("my_favorites") },
    { href: `/${locale}/messages`,               iconKey: "messages",      label: t("my_messages") },
    { href: `/${locale}/account/verification`,   iconKey: "verification",  label: t("verification_title") },
    { href: `/${locale}/account/settings`,       iconKey: "settings",      label: t("settings_title") },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* 用户信息 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-100 border border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.name ?? ""} className="w-full h-full object-cover" />
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
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:bg-primary-50 transition-colors text-center group"
          >
            <span className="text-gray-500 group-hover:text-primary transition-colors">
              {quickLinkIcons[item.iconKey]}
            </span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
