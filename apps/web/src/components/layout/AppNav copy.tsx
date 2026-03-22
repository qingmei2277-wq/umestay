"use client";

import { useRouter, usePathname } from "next/navigation";
import { Nav } from "@umestay/ui/composite";

type Locale = "zh" | "ja" | "en";

interface AppNavProps {
  locale: Locale;
}

const PAGE_ROUTES: Record<string, string> = {
  list:       "/",
  properties: "/properties",
  login:      "/(auth)/login",
  register:   "/(auth)/register",
  messages:   "/messages",
  account:    "/account",
  bookings:   "/bookings",
  favorites:  "/favorites",
};

export function AppNav({ locale }: AppNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (page: string) => {
    const route = PAGE_ROUTES[page] ?? "/";
    router.push(`/${locale}${route}`);
  };

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace current locale prefix in the pathname
    const withoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${newLocale}${withoutLocale}`);
  };

  // Derive currentPage from pathname
  const segment = pathname.replace(new RegExp(`^/${locale}`), "").split("/")[1] ?? "";
  const currentPage =
    Object.entries(PAGE_ROUTES).find(([, r]) => r.replace("/", "") === segment)?.[0] ?? "list";

  return (
    <Nav
      locale={locale}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLocaleChange={handleLocaleChange}
    />
  );
}
