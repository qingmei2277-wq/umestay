"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createUmestayServerClient } from "@umestay/db";

export type ProfileFormState = { success: true } | { error: string } | null;

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const locale = (formData.get("locale") as string) || "zh";
  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {}
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const phoneCountry = (formData.get("phone_country") as string).trim();
  const phoneLocal = (formData.get("phone_local") as string).trim().replace(/\D/g, "");
  const phone = phoneLocal ? `${phoneCountry}${phoneLocal}` : "";

  const updates: Record<string, string | null> = {
    name: formData.get("name") as string,
    preferred_lang: formData.get("preferred_lang") as string,
  };
  if (phone) updates.phone = phone;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateProfile] DB error:", error.message);
    return { error: error.message };
  }

  revalidatePath(`/${locale}/account/profile`);
  return { success: true };
}
