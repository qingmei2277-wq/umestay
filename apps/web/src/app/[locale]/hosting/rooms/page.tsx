import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createUmestayServerClient } from "@umestay/db";
import { RoomsList } from "@/components/hosting/RoomsList";
import { toggleRoomStatus } from "@/actions/hosting";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("rooms_title") };
}

export default async function HostingRoomsPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/hosting/rooms`);

  const { data: rooms } = await supabase
    .from("properties")
    .select("id, title_zh, title_ja, title_en, status, type, managed_by, prefecture, city, price_daily, price_monthly, updated_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const labels = {
    edit: t("room_edit"),
    calendar: t("room_calendar"),
    statusActive: t("room_status_active"),
    statusInactive: t("room_status_inactive"),
    statusDraft: t("room_status_draft"),
    managedPlatform: t("room_managed_platform"),
    managedHost: t("room_managed_host"),
    toggleActive: t("room_toggle_active"),
    toggleInactive: t("room_toggle_inactive"),
    noRooms: t("no_rooms"),
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("rooms_title")}</h1>
        <Link
          href={`/${locale}/hosting/rooms/new`}
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          + {t("room_new")}
        </Link>
      </div>
      <RoomsList
        rooms={rooms ?? []}
        locale={locale}
        labels={labels}
        toggleStatus={toggleRoomStatus}
      />
    </>
  );
}
