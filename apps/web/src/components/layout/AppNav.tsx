"use client";

import { Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Nav } from "@umestay/ui/composite";
import { useUser } from "@/components/providers/UserProvider";
import { AuthModalContent } from "@/components/auth/AuthModalContent";
import { NavSearchBar } from "./NavSearchBar";

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

// 在这些路由段显示搜索框
const SEARCH_BAR_SEGMENTS = ["properties"];

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

  // 房源列表页和房源详情页均显示搜索框
  const showSearchBar = SEARCH_BAR_SEGMENTS.includes(segment);

  return (
    <Nav
      locale={locale}
      currentPage={currentPage}
      user={user ? { name: user.name, avatar_url: user.avatar_url } : null}
      onNavigate={handleNavigate}
      onLocaleChange={handleLocaleChange}
      onSignOut={signOut}
      authModalContent={<AuthModalContent />}
      searchBar={
        showSearchBar ? (
          // useSearchParams 需要 Suspense 包裹
          <Suspense fallback={<div className="h-11 w-[420px] bg-gray-100 rounded-full animate-pulse" />}>
            <NavSearchBar locale={locale} />
          </Suspense>
        ) : undefined
      }
    />
  );
}
