import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; detail?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("reset_password_title") };
}

export default async function ResetPasswordPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { error, detail } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <main className="min-h-[calc(100vh-58px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">UMESTAY</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">
            {t("reset_password_title")}
          </h2>
        </div>

        {error === "invalid_link" && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl text-center space-y-1">
            <p>{t("reset_link_invalid")}</p>
            {detail && (
              <p className="text-xs text-red-400 break-all">{detail}</p>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ResetPasswordForm />
        </div>

        <p className="text-center text-sm text-gray-500">
          <Link href={`/${locale}/login`} className="text-primary hover:underline">
            ← {t("login_link")}
          </Link>
        </p>
      </div>
    </main>
  );
}
