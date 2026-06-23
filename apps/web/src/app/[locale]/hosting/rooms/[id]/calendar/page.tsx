import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { SingleRoomCalendar } from "@/components/hosting/SingleRoomCalendar";
import { blockDates, unblockDates } from "@/actions/hosting";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("calendar_title") };
}

export default async function RoomCalendarPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });

  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/hosting/rooms/${id}/calendar`);

  const { data: room } = await supabase
    .from("properties")
    .select("id, title_zh")
    .eq("id", id)
    .single();

  const { data: blocks } = await supabase
    .from("calendar_blocks")
    .select("blocked_date, source, note")
    .eq("property_id", id);

  const { data: bookings } = await supabase
    .from("bookings")
    .select("checkin, checkout, status, id")
    .eq("property_id", id)
    .in("status", ["confirmed", "pending_payment", "checked_in"]);

  const labels: { [key: string]: string } = {
    calendar_title: t("calendar_title"),
    calendar_prev: t("calendar_prev"),
    calendar_next: t("calendar_next"),
    calendar_today: t("calendar_today"),
    calendar_legend_confirmed: t("calendar_legend_confirmed"),
    calendar_legend_pending: t("calendar_legend_pending"),
    calendar_legend_blocked_manual: t("calendar_legend_blocked_manual"),
    calendar_legend_blocked_hostex: t("calendar_legend_blocked_hostex"),
    calendar_block_title: t("calendar_block_title"),
    calendar_block_reason: t("calendar_block_reason"),
    calendar_block_reason_maintenance: t("calendar_block_reason_maintenance"),
    calendar_block_reason_personal: t("calendar_block_reason_personal"),
    calendar_block_reason_other: t("calendar_block_reason_other"),
    calendar_block_confirm: t("calendar_block_confirm"),
    calendar_unblock_confirm: t("calendar_unblock_confirm"),
  };

  const roomTitle = room ? ((room as Record<string, unknown>).title_zh as string | null) ?? id : id;

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("calendar_title")}</h1>
        {roomTitle && (
          <span className="text-sm text-gray-500">— {roomTitle}</span>
        )}
      </div>
      <SingleRoomCalendar
        propertyId={id}
        blocks={(blocks ?? []) as Array<{ blocked_date: string; source: string; note?: string | null }>}
        bookings={(bookings ?? []) as Array<{ checkin: string; checkout: string; status: string; id: string }>}
        labels={labels}
        blockDates={blockDates}
        unblockDates={unblockDates}
      />
    </>
  );
}
