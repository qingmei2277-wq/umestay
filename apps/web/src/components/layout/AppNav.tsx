"use client";

import { useRouter, usePathname } from "next/navigation";
import { Nav } from "@umestay/ui/composite";
import { useUser } from "@/components/providers/UserProvider";
import { AuthModalContent } from "@/components/auth/AuthModalContent";

type Locale = "zh" | "ja" | "en";

interface AppNavProps {
  locale: Locale;
}

const PAGE_ROUTES: Record<string, string> = {
  list:       "/",
  properties: "/properties",
  login:      "/login",
  register:   "/register",
  messages:   "/messages",
  account:    "/account",
  bookings:   "/bookings",
  favorites:  "/favorites",
};

export function AppNav({ locale }: AppNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useUser();

  const handleNavigate = (page: string) => {
    const route = PAGE_ROUTES[page] ?? "/";
    router.push(`/${locale}${route}`);
  };

  const handleLocaleChange = (newLocale: Locale) => {
    const withoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${newLocale}${withoutLocale}`);
  };

  const segment = pathname.replace(new RegExp(`^/${locale}`), "").split("/")[1] ?? "";
  const currentPage =
    Object.entries(PAGE_ROUTES).find(([, r]) => r.replace(/^\//, "") === segment)?.[0] ?? "list";

  return (
    <Nav
      locale={locale}
      currentPage={currentPage}
      user={user ? { name: user.name, avatar_url: user.avatar_url } : null}
      onNavigate={handleNavigate}
      onLocaleChange={handleLocaleChange}
      onSignOut={signOut}
      authModalContent={<AuthModalContent />}
    />
  );
}
