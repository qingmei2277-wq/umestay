import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { HostingBookingDetail } from "@/components/hosting/HostingBookingDetail";
import { confirmBooking, rejectBooking } from "@/actions/hosting";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("bookings_title") };
}

export default async function HostingBookingDetailPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login`);

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (!booking) redirect(`/${locale}/hosting/bookings`);

  const b = booking as Record<string, unknown>;

  const { data: property } = await supabase
    .from("properties")
    .select("id, title_zh, title_ja, title_en, owner_id")
    .eq("id", b.property_id as string)
    .single();

  if (!property) redirect(`/${locale}/hosting/bookings`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const isAdmin = profile && ["operator", "super_admin"].includes(profile.role as string);

  if (!isAdmin && property.owner_id !== user.id) {
    redirect(`/${locale}/hosting/bookings`);
  }

  const labels = {
    back: t("bookings_title"),
    confirm: t("booking_confirm"),
    reject: t("booking_reject"),
    rejectReason: t("booking_reject_reason"),
    rejectConfirm: t("booking_reject_confirm"),
    labelProperty: t("booking_property"),
    labelDates: t("booking_dates"),
    labelGuests: t("booking_guests"),
    labelTotal: t("booking_total"),
    labelPayout: t("booking_payout"),
    statusPending: t("booking_status_pending"),
    statusConfirmed: t("booking_status_confirmed"),
    statusCheckedIn: t("booking_status_checked_in"),
    statusCompleted: t("booking_status_completed"),
    statusCancelled: t("booking_status_cancelled"),
  };

  return (
    <HostingBookingDetail
      booking={b}
      property={property as Record<string, unknown>}
      locale={locale}
      labels={labels}
      confirmBooking={confirmBooking}
      rejectBooking={rejectBooking}
    />
  );
}
