import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("update_password") };
}

export default async function UpdatePasswordPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { token_hash, type } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <main className="min-h-[calc(100vh-58px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">UMESTAY</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">
            {t("update_password")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{t("update_password_desc")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <UpdatePasswordForm tokenHash={type === "recovery" ? token_hash : undefined} />
        </div>
      </div>
    </main>
  );
}
