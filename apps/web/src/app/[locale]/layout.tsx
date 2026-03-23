import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { locales, type Locale } from "@umestay/i18n";
import { createUmestayServerClient } from "@umestay/db";
import type { Profile } from "@umestay/db";
import { AppNav } from "@/components/layout/AppNav";
import { UserProvider } from "@/components/providers/UserProvider";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UMESTAY | Short-term & Monthly Rentals in Japan",
    template: "%s | UMESTAY",
  },
  description:
    "Find your perfect stay in Japan — short-term or monthly furnished rentals.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getInitialProfile(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createUmestayServerClient({
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const [messages, initialProfile] = await Promise.all([
    getMessages(),
    getInitialProfile(),
  ]);

  return (
    <html lang={locale} className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <UserProvider initialProfile={initialProfile}>
            <AppNav locale={locale as "zh" | "ja" | "en"} />
            {children}
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
