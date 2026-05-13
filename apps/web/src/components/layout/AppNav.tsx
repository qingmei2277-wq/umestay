"use client";

import { Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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

const HOST_ROLES = ["host", "co_host", "operator", "super_admin"] as const;

function L(locale: Locale, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

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

  // 房东模式切换按钮
  const isHost = user?.role && (HOST_ROLES as readonly string[]).includes(user.role);
  const isHostingMode = pathname.startsWith(`/${locale}/hosting`);

  const hostModeButton = isHost ? (
    isHostingMode ? (
      <Link
        href={`/${locale}`}
        // className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-600 transition-colors"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        {L(locale, "访客模式", "ゲストモード", "Guest Mode")}
      </Link>
    ) : (
      <Link
        href={`/${locale}/hosting`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3.5 h-3.5 lucide lucide-settings2-icon lucide-settings-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
        {L(locale, "房东工作台模式", "管理モード", "Hosting Mode")}
      </Link>
    )
  ) : undefined;

  return (
    <Nav
      locale={locale}
      currentPage={currentPage}
      user={user ? { name: user.name, avatar_url: user.avatar_url } : null}
      onNavigate={handleNavigate}
      onLocaleChange={handleLocaleChange}
      onSignOut={signOut}
      authModalContent={<AuthModalContent />}
      hostModeButton={hostModeButton}
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
