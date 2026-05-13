import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { MultiRoomCalendar } from "@/components/hosting/MultiRoomCalendar";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("calendar_title") };
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur < last) {
    dates.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export default async function HostingCalendarPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/hosting/calendar`);

  const { data: rooms } = await supabase
    .from("properties")
    .select("id, title_zh, title_ja, status")
    .eq("owner_id", user.id)
    .in("status", ["active", "inactive"]);

  const roomList = (rooms ?? []) as Array<Record<string, unknown>>;
  const roomIds = roomList.map((r) => r.id as string);

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);
  const todayStr = formatDate(today);
  const endStr = formatDate(endDate);

  // Fetch blocks for all rooms
  const { data: allBlocks } = roomIds.length > 0
    ? await supabase
        .from("calendar_blocks")
        .select("property_id, blocked_date, source")
        .in("property_id", roomIds)
        .gte("blocked_date", todayStr)
        .lte("blocked_date", endStr)
    : { data: [] };

  // Fetch bookings for all rooms
  const { data: allBookings } = roomIds.length > 0
    ? await supabase
        .from("bookings")
        .select("property_id, checkin_date, checkout_date, status")
        .in("property_id", roomIds)
        .in("status", ["confirmed", "pending_payment", "checked_in"])
        .gte("checkout_date", todayStr)
    : { data: [] };

  const blocksList = (allBlocks ?? []) as Array<Record<string, unknown>>;
  const bookingsList = (allBookings ?? []) as Array<Record<string, unknown>>;

  // Build per-room sets
  const blocksMap = new Map<string, Set<string>>();
  for (const b of blocksList) {
    const pid = b.property_id as string;
    if (!blocksMap.has(pid)) blocksMap.set(pid, new Set());
    blocksMap.get(pid)!.add(b.blocked_date as string);
  }

  const bookingsMap = new Map<string, Map<string, string>>();
  for (const bk of bookingsList) {
    const pid = bk.property_id as string;
    if (!bookingsMap.has(pid)) bookingsMap.set(pid, new Map());
    const checkin = bk.checkin_date as string;
    const checkout = bk.checkout_date as string;
    const status = bk.status as string;
    if (checkin && checkout) {
      for (const d of getDatesInRange(checkin, checkout)) {
        bookingsMap.get(pid)!.set(d, status);
      }
    }
  }

  const roomCalendarData = roomList.map((r) => ({
    id: r.id as string,
    title: (r.title_zh ?? r.title_ja ?? r.id) as string,
    locale,
    blockedDates: blocksMap.get(r.id as string) ?? new Set<string>(),
    bookedDates: bookingsMap.get(r.id as string) ?? new Map<string, string>(),
  }));

  const labels: { [key: string]: string } = {
    calendar_title: t("calendar_title"),
    calendar_legend_confirmed: t("calendar_legend_confirmed"),
    calendar_legend_pending: t("calendar_legend_pending"),
    calendar_legend_blocked_manual: t("calendar_legend_blocked_manual"),
    calendar_legend_blocked_hostex: t("calendar_legend_blocked_hostex"),
  };

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("calendar_title")}</h1>
      <MultiRoomCalendar
        rooms={roomCalendarData}
        startDate={todayStr}
        labels={labels}
      />
    </>
  );
}
