import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { ProfileForm } from "@/components/account/ProfileForm";
import { updateProfileAction } from "@/actions/profile";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("profile_title") };
}

// 将 E.164 号码拆分为区号 + 本地号码
const KNOWN_CODES = ["+852", "+853", "+886", "+86", "+81", "+82", "+65", "+61", "+44", "+33", "+49", "+1", "+7"];
function parseE164(e164: string | null | undefined): { countryCode: string; local: string } {
  if (!e164 || !e164.startsWith("+")) return { countryCode: "+86", local: "" };
  for (const code of KNOWN_CODES) {
    if (e164.startsWith(code)) return { countryCode: code, local: e164.slice(code.length) };
  }
  return { countryCode: "+86", local: e164.slice(1) };
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

  const { countryCode, local: localPhone } = parseE164(profile?.phone);

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

      <ProfileForm
        locale={locale}
        defaultName={profile?.name ?? ""}
        countryCode={countryCode}
        localPhone={localPhone}
        preferredLang={profile?.preferred_lang ?? locale}
        langOptions={langOptions}
        labels={{
          name: t("name_label"),
          phone: t("phone_label"),
          preferredLang: t("preferred_lang_label"),
          save: t("save_profile"),
          saved: t("profile_saved"),
        }}
        updateProfile={updateProfileAction}
      />
    </main>
  );
}
