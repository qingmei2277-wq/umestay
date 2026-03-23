import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";
import { SettingsClient } from "@/components/account/SettingsClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("settings_title") };
}

export default async function SettingsPage({ params }: PageProps) {
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
  if (!user) redirect(`/${locale}/login?next=/${locale}/account/settings`);

  const labels = {
    title: t("settings_title"),
    changePassword: t("change_password"),
    currentPassword: t("current_password"),
    newPassword: t("new_password"),
    signOut: t("sign_out"),
    dangerZone: t("danger_zone"),
    deleteAccount: t("delete_account"),
    deleteConfirm: t("delete_confirm"),
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 mb-8">{labels.title}</h1>
      <SettingsClient locale={locale} labels={labels} hasEmail={!!user.email} />
    </main>
  );
}
