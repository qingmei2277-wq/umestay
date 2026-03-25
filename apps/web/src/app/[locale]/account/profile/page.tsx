import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUmestayServerClient } from "@umestay/db";
import { AvatarUpload } from "@/components/account/AvatarUpload";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("profile_title") };
}

export default async function ProfilePage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/account/profile`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";
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
    if (!user) redirect(`/${locale}/login?next=/${locale}/account/profile`);

    const phone = (formData.get("phone") as string).trim();

    // phone 必须符合 E.164 格式，为空时不更新（保留原值）
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
      throw new Error(error.message);
    }

    revalidatePath(`/${locale}/account/profile`);
  }

  const langOptions = [
    { value: "zh", label: t("preferred_lang_zh") },
    { value: "ja", label: t("preferred_lang_ja") },
    { value: "en", label: t("preferred_lang_en") },
  ];

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 mb-8">{t("profile_title")}</h1>

      {/* 头像 */}
      <div className="flex flex-col items-center mb-8">
        <AvatarUpload
          userId={user.id}
          currentAvatarUrl={profile?.avatar_url ?? null}
          name={profile?.name ?? ""}
          uploadLabel={t("upload_avatar")}
        />
      </div>

      {/* 表单 */}
      <form action={updateProfile} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t("name_label")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={profile?.name ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t("phone_label")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="preferred_lang" className="block text-sm font-medium text-gray-700 mb-1">
            {t("preferred_lang_label")}
          </label>
          <select
            id="preferred_lang"
            name="preferred_lang"
            defaultValue={profile?.preferred_lang ?? locale}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white"
          >
            {langOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          {t("save_profile")}
        </button>
      </form>
    </main>
  );
}
