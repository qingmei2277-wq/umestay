"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createUmestayServerClient } from "@umestay/db";

export type ProfileFormState =
  | { success: true; emailVerificationSent?: boolean }
  | { error: string }
  | null;

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

  const lastName  = (formData.get("last_name")  as string || "").trim();
  const firstName = (formData.get("first_name") as string || "").trim();
  const name = [lastName, firstName].filter(Boolean).join(" ") || null;

  const phoneCountry = (formData.get("phone_country") as string || "").trim();
  const phoneLocal   = (formData.get("phone_local")   as string || "").trim().replace(/\D/g, "");
  const phone = phoneLocal ? `${phoneCountry}${phoneLocal}` : "";

  const newEmail = (formData.get("email") as string || "").trim().toLowerCase();

  // 更新 profiles 表
  // 先尝试写入 last_name / first_name，如果列不存在则回退到只写 name
  const fullUpdates: Record<string, string | null> = {
    last_name:      lastName  || null,
    first_name:     firstName || null,
    name,
    preferred_lang: formData.get("preferred_lang") as string,
  };
  if (phone) fullUpdates.phone = phone;

  let profileError = (
    await supabase.from("profiles").update(fullUpdates).eq("user_id", user.id)
  ).error;

  // 如果因为列不存在报错，回退到只更新 name（兼容迁移未执行的情况）
  if (profileError?.message?.includes("first_name") || profileError?.message?.includes("last_name")) {
    const fallbackUpdates: Record<string, string | null> = {
      name,
      preferred_lang: formData.get("preferred_lang") as string,
    };
    if (phone) fallbackUpdates.phone = phone;
    profileError = (
      await supabase.from("profiles").update(fallbackUpdates).eq("user_id", user.id)
    ).error;
  }

  if (profileError) {
    console.error("[updateProfile] DB error:", profileError.message);
    return { error: profileError.message };
  }

  // 如果邮箱有变化，调用 Supabase Auth 更新（会向新地址发确认邮件）
  let emailVerificationSent = false;
  if (newEmail && newEmail !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
    if (emailError) {
      console.error("[updateProfile] email update error:", emailError.message);
      return { error: emailError.message };
    }
    emailVerificationSent = true;
  }

  revalidatePath(`/${locale}/account/profile`);
  return { success: true, emailVerificationSent };
}
