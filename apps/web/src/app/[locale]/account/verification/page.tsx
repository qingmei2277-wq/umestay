import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUmestayServerClient, createUmestayServiceClient } from "@umestay/db";
import { KycStatusBanner } from "@/components/account/KycStatusBanner";
import { KycUploadForm } from "@/components/account/KycUploadForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("verification_title") };
}

export default async function VerificationPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/account/verification`);

  const { data: kycRecord } = await supabase
    .from("kyc_verifications")
    .select("status, doc_type, created_at, reviewed_at, reject_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  async function submitVerification(formData: FormData) {
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
    const serviceClient = createUmestayServiceClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const frontFile = formData.get("front") as File;
    const backFile = formData.get("back") as File | null;
    const docType = formData.get("doc_type") as string;

    const { data: kyc, error } = await supabase
      .from("kyc_verifications")
      .insert({ user_id: user.id, doc_type: docType, status: "pending" })
      .select("id")
      .single();
    if (error) return { error: "提交失败，请重试" };

    await serviceClient.storage
      .from("kyc-documents")
      .upload(`${user.id}/${kyc.id}/front`, frontFile, { upsert: true });

    if (backFile && backFile.size > 0) {
      await serviceClient.storage
        .from("kyc-documents")
        .upload(`${user.id}/${kyc.id}/back`, backFile, { upsert: true });
    }

    revalidatePath(`/[locale]/account/verification`, "page");
  }

  const docTypeOptions = [
    { value: "passport", label: t("doc_passport") },
    { value: "residence_card", label: t("doc_residence") },
    { value: "my_number_card", label: t("doc_mynumber") },
    { value: "driver_license", label: t("doc_driver_license") },
    { value: "other", label: t("doc_other") },
  ];

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("verification_title")}</h1>

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
          onSubmit={submitVerification}
          docTypeOptions={docTypeOptions}
          labels={{
            docType: t("kyc_doc_type"),
            front: t("kyc_front"),
            back: t("kyc_back"),
            submit: t("kyc_submit"),
          }}
        />
      )}
    </main>
  );
}
