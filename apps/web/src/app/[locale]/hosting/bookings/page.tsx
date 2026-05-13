import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { HostingBookingsList } from "@/components/hosting/HostingBookingsList";
import { confirmBooking, rejectBooking } from "@/actions/hosting";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("bookings_title") };
}

export default async function HostingBookingsPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/hosting/bookings`);

  const { data: roomIds } = await supabase
    .from("properties")
    .select("id")
    .eq("owner_id", user.id);

  const ids = ((roomIds ?? []) as Array<Record<string, unknown>>).map((r) => r.id as string);

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, property_id, status, checkin_date, checkout_date, total_price, guest_count, created_at, guest_id")
    .in("property_id", ids.length > 0 ? ids : [""])
    .order("created_at", { ascending: false });

  const labels: { [key: string]: string } = {
    bookings_title: t("bookings_title"),
    booking_status_all: t("booking_status_all"),
    booking_status_pending: t("booking_status_pending"),
    booking_status_confirmed: t("booking_status_confirmed"),
    booking_status_checked_in: t("booking_status_checked_in"),
    booking_status_completed: t("booking_status_completed"),
    booking_status_cancelled: t("booking_status_cancelled"),
    booking_confirm: t("booking_confirm"),
    booking_reject: t("booking_reject"),
    booking_reject_reason: t("booking_reject_reason"),
    booking_reject_confirm: t("booking_reject_confirm"),
    booking_guest: t("booking_guest"),
    booking_property: t("booking_property"),
    booking_dates: t("booking_dates"),
    booking_guests: t("booking_guests"),
    booking_total: t("booking_total"),
    booking_payout: t("booking_payout"),
    no_bookings: t("no_bookings"),
  };

  type BookingRow = {
    id: string;
    property_id: string;
    status: string;
    checkin_date: string | null;
    checkout_date: string | null;
    total_price: number | null;
    guest_count: number | null;
    created_at: string;
  };

  const bookingRows = ((bookings ?? []) as Array<Record<string, unknown>>).map((b) => ({
    id: b.id as string,
    property_id: b.property_id as string,
    status: b.status as string,
    checkin_date: (b.checkin_date as string) ?? null,
    checkout_date: (b.checkout_date as string) ?? null,
    total_price: (b.total_price as number) ?? null,
    guest_count: (b.guest_count as number) ?? null,
    created_at: b.created_at as string,
  })) satisfies BookingRow[];

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("bookings_title")}</h1>
      <HostingBookingsList
        bookings={bookingRows}
        locale={locale}
        labels={labels}
        confirmBooking={confirmBooking}
        rejectBooking={rejectBooking}
      />
    </>
  );
}
