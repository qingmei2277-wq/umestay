import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { RoomForm } from "@/components/hosting/RoomForm";
import { saveRoom } from "@/actions/hosting";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting" });
  return { title: t("room_edit") };
}

export default async function EditRoomPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/hosting/rooms/${id}/edit`);

  const { data: room } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!room) redirect(`/${locale}/hosting/rooms`);

  const labels = {
    form_step_basic: t("form_step_basic"),
    form_step_location: t("form_step_location"),
    form_step_amenities: t("form_step_amenities"),
    form_step_pricing: t("form_step_pricing"),
    form_step_photos: t("form_step_photos"),
    form_step_review: t("form_step_review"),
    form_title_zh: t("form_title_zh"),
    form_title_ja: t("form_title_ja"),
    form_title_en: t("form_title_en"),
    form_description_zh: t("form_description_zh"),
    form_type: t("form_type"),
    form_type_daily: t("form_type_daily"),
    form_type_monthly: t("form_type_monthly"),
    form_license: t("form_license"),
    form_license_hint: t("form_license_hint"),
    form_checkin_method: t("form_checkin_method"),
    form_cancellation_policy: t("form_cancellation_policy"),
    form_house_rules: t("form_house_rules"),
    form_prefecture: t("form_prefecture"),
    form_city: t("form_city"),
    form_address_detail: t("form_address_detail"),
    form_nearest_station: t("form_nearest_station"),
    form_walk_min: t("form_walk_min"),
    form_max_guests: t("form_max_guests"),
    form_area: t("form_area"),
    form_floor: t("form_floor"),
    form_price_daily: t("form_price_daily"),
    form_price_monthly: t("form_price_monthly"),
    form_cleaning_fee: t("form_cleaning_fee"),
    form_deposit: t("form_deposit"),
    form_save_draft: t("form_save_draft"),
    form_publish: t("form_publish"),
    form_next: t("form_next"),
    form_prev: t("form_prev"),
    form_step_setup: t("form_step_setup"),
    form_setup_basics_title: t("form_setup_basics_title"),
    form_setup_basics_hint: t("form_setup_basics_hint"),
    form_guests: t("form_guests"),
    form_bedrooms: t("form_bedrooms"),
    form_beds: t("form_beds"),
    form_bathrooms: t("form_bathrooms"),
    form_amenities_title: t("form_amenities_title"),
    form_amenities_hint: t("form_amenities_hint"),
    form_amenities_popular: t("form_amenities_popular"),
    form_amenities_premium: t("form_amenities_premium"),
    form_amenity_wifi: t("form_amenity_wifi"),
    form_amenity_tv: t("form_amenity_tv"),
    form_amenity_kitchen: t("form_amenity_kitchen"),
    form_amenity_washer: t("form_amenity_washer"),
    form_amenity_parking: t("form_amenity_parking"),
    form_amenity_air_conditioning: t("form_amenity_air_conditioning"),
    form_amenity_workspace: t("form_amenity_workspace"),
    form_amenity_pool: t("form_amenity_pool"),
    form_amenity_hot_tub: t("form_amenity_hot_tub"),
    form_amenity_terrace: t("form_amenity_terrace"),
    form_amenity_bbq: t("form_amenity_bbq"),
    form_structure_question: t("form_structure_question"),
    form_structure_house: t("form_structure_house"),
    form_structure_apartment: t("form_structure_apartment"),
    form_structure_hotel: t("form_structure_hotel"),
    form_structure_ryokan: t("form_structure_ryokan"),
    form_offering_question: t("form_offering_question"),
    form_offering_entire: t("form_offering_entire"),
    form_offering_entire_desc: t("form_offering_entire_desc"),
    form_offering_room: t("form_offering_room"),
    form_offering_room_desc: t("form_offering_room_desc"),
  };

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("room_edit")}</h1>
      <RoomForm
        locale={locale}
        roomId={id}
        defaultValues={room as Record<string, unknown>}
        labels={labels}
        saveRoom={saveRoom}
      />
    </>
  );
}
