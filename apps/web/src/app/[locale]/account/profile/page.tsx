import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { ProfileForm } from "@/components/account/ProfileForm";
import { KycStatusBanner } from "@/components/account/KycStatusBanner";
import { KycUploadForm } from "@/components/account/KycUploadForm";
import { updateProfileAction } from "@/actions/profile";
import { submitVerificationAction } from "@/actions/kyc";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("nav_profile") };
}

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

  const [profileRes, kycRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("kyc_verifications")
      .select("status, doc_type, created_at, reviewed_at, reject_reason")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const profile = profileRes.data;
  const kycRecord = kycRes.data;
  const { countryCode, local: localPhone } = parseE164(profile?.phone);

  const langOptions = [
    { value: "zh", label: t("preferred_lang_zh") },
    { value: "ja", label: t("preferred_lang_ja") },
    { value: "en", label: t("preferred_lang_en") },
  ];

  const docTypeOptions = [
    { value: "passport", label: t("doc_passport") },
    { value: "residence_card", label: t("doc_residence") },
    { value: "my_number_card", label: t("doc_mynumber") },
    { value: "driver_license", label: t("doc_driver_license") },
    { value: "other", label: t("doc_other") },
  ];

  return (
    <>
      {/* 个人信息 */}
      <h1 className="text-xl font-bold text-gray-900 mb-8">{t("nav_profile")}</h1>

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
        defaultLastName={profile?.last_name ?? ""}
        defaultFirstName={profile?.first_name ?? ""}
        email={user.email ?? ""}
        countryCode={countryCode}
        localPhone={localPhone}
        preferredLang={profile?.preferred_lang ?? locale}
        langOptions={langOptions}
        labels={{
          fullName: t("full_name"),
          lastName: t("last_name_label"),
          firstName: t("first_name_label"),
          nameIdHint: t("name_id_hint"),
          email: t("email_label"),
          emailUpdateHint: t("email_update_hint"),
          emailVerificationSent: t("email_verification_sent"),
          phone: t("phone_label"),
          preferredLang: t("preferred_lang_label"),
          save: t("save_profile"),
          saved: t("profile_saved"),
        }}
        updateProfile={updateProfileAction}
      />

      {/* 身份验证 */}
      {/* <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">{t("verification_section_title")}</h2>

        {kycRecord ? (
          <KycStatusBanner
            status={kycRecord.status as string}
            rejectReason={kycRecord.reject_reason as string | null}
            labels={{
              pending: t("kyc_pending"),
              approved: t("kyc_approved"),
              rejected: t("kyc_rejected"),
              rejectReason: (r: string) => t("kyc_reject_reason", { reason: r }),
              resubmit: t("kyc_resubmit"),
            }}
          />
        ) : (
          <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded-lg mb-6">
            {t("kyc_intro")}
          </div>
        )}

        {(!kycRecord || (kycRecord.status as string) === "rejected") && (
          <KycUploadForm
            onSubmit={submitVerificationAction}
            docTypeOptions={docTypeOptions}
            labels={{
              docType: t("kyc_doc_type"),
              front: t("kyc_front"),
              back: t("kyc_back"),
              submit: t("kyc_submit"),
            }}
          />
        )}
      </div> */}
    </>
  );
}
