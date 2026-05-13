"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";

// ── helpers ──────────────────────────────────────────────────────────────────
async function getSupabase() {
  const cookieStore = await cookies();
  return createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cs) => {
      try { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
    },
  });
}

// ── T4.5.2 toggleRoomStatus ───────────────────────────────────────────────────
export async function toggleRoomStatus(roomId: string, currentStatus: string) {
  const supabase = await getSupabase();
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  const { error } = await supabase.from("properties").update({ status: newStatus }).eq("id", roomId);
  if (error) return { error: error.message };
  revalidatePath("/hosting/rooms");
  return { status: newStatus };
}

// ── T4.5.3 saveRoom ───────────────────────────────────────────────────────────
export async function saveRoom(formData: FormData) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const locale = (formData.get("locale") as string) || "zh";
  const roomId = formData.get("room_id") as string | null;
  const isDraft = formData.get("action") === "draft";

  const payload: Record<string, unknown> = {
    title_zh: formData.get("title_zh") as string,
    title_ja: (formData.get("title_ja") as string) || null,
    title_en: (formData.get("title_en") as string) || null,
    description_zh: (formData.get("description_zh") as string) || null,
    description_ja: (formData.get("description_ja") as string) || null,
    description_en: (formData.get("description_en") as string) || null,
    type: formData.get("type") as string,
    status: isDraft ? "draft" : "active",
    license_number: (formData.get("license_number") as string) || null,
    checkin_method: (formData.get("checkin_method") as string) || null,
    cancellation_policy: (formData.get("cancellation_policy") as string) || null,
    house_rules: (formData.get("house_rules") as string) || null,
    price_daily: Number(formData.get("price_daily")) || null,
    price_monthly: Number(formData.get("price_monthly")) || null,
    cleaning_fee: Number(formData.get("cleaning_fee")) || 0,
    deposit_amount: Number(formData.get("deposit_amount")) || 0,
    max_guests: Number(formData.get("max_guests")) || 1,
    area_sqm: Number(formData.get("area_sqm")) || null,
    floor: Number(formData.get("floor")) || null,
    prefecture: (formData.get("prefecture") as string) || null,
    city: (formData.get("city") as string) || null,
    address_detail: (formData.get("address_detail") as string) || null,
    nearest_station: (formData.get("nearest_station") as string) || null,
    station_walk_min: Number(formData.get("station_walk_min")) || null,
  };

  // Validate: if publishing, license_number required
  if (!isDraft && !payload.license_number) {
    return { error: "発布前必须填写民泊届出番号（license_number）" };
  }
  // Validate: title required
  if (!payload.title_zh) {
    return { error: "请填写房源中文标题" };
  }

  let savedId = roomId;

  if (roomId) {
    const { error } = await supabase.from("properties").update(payload).eq("id", roomId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("properties")
      .insert({ ...payload, owner_id: user.id, managed_by: "host" })
      .select("id")
      .single();
    if (error) return { error: error.message };
    savedId = data.id;
  }

  revalidatePath(`/${locale}/hosting/rooms`);
  redirect(`/${locale}/hosting/rooms`);
}

// ── T4.5.4 blockDates ─────────────────────────────────────────────────────────
export async function blockDates(propertyId: string, dates: string[], note?: string) {
  const supabase = await getSupabase();
  const rows = dates.map((d) => ({
    property_id: propertyId,
    blocked_date: d,
    source: "manual" as const,
    note: note ?? null,
  }));
  const { error } = await supabase.from("calendar_blocks").upsert(rows, {
    onConflict: "property_id,blocked_date",
  });
  if (error) return { error: error.message };
  revalidatePath(`/hosting/rooms/${propertyId}/calendar`);
  return { ok: true };
}

export async function unblockDates(propertyId: string, dates: string[]) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("calendar_blocks")
    .delete()
    .eq("property_id", propertyId)
    .in("blocked_date", dates);
  if (error) return { error: error.message };
  revalidatePath(`/hosting/rooms/${propertyId}/calendar`);
  return { ok: true };
}

// ── T4.5.6 booking actions ────────────────────────────────────────────────────
export async function confirmBooking(bookingId: string) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/hosting/bookings");
  return { ok: true };
}

export async function rejectBooking(bookingId: string, reason: string) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled_by_host",
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/hosting/bookings");
  return { ok: true };
}
