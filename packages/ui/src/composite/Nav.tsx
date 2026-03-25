"use client";

import { useState } from "react";
import { cn } from "../utils/cn";
import { AuthModal } from "./AuthModal";

type Locale = "zh" | "ja" | "en";

interface NavUser {
  name?: string | null;
  avatar_url?: string | null;
}

interface NavProps {
  locale?: Locale;
  currentPage?: string;
  user?: NavUser | null;
  unreadCount?: number;
  onNavigate?: (page: string) => void;
  onLocaleChange?: (locale: Locale) => void;
  onSignOut?: () => void;
  authModalContent?: React.ReactNode;
}

const L = (locale: Locale, zh: string, ja: string, en: string) =>
  locale === "zh" ? zh : locale === "ja" ? ja : en;

export function Nav({
  locale = "zh",
  currentPage,
  user,
  unreadCount = 0,
  onNavigate,
  onLocaleChange,
  onSignOut,
  authModalContent,
}: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false); // ← 新增

  const nav = (page: string) => { onNavigate?.(page); setMenuOpen(false); setMobileOpen(false); };

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-[300]">
      <div className="max-w-[1160px] mx-auto px-6 h-[58px] flex items-center gap-5">

        {/* Logo */}
        <button
          onClick={() => nav("list")}
          className="flex items-center gap-2 flex-shrink-0 bg-transparent border-none cursor-pointer">
          <img src="/logo.png" alt="Umestay" width={30} height={30} className="rounded-lg" />
          <span className="text-base font-bold text-stone-800">Umestay</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          {([
            [L(locale, "首页", "トップ", "Home"), "list"],
            [L(locale, "房源", "物件", "Listings"), "properties"],
          ] as [string, string][]).map(([label, page]) => (
            <button
              key={page}
              onClick={() => nav(page)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                currentPage === page
                  ? "text-primary bg-primary-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Locale switcher */}
        {onLocaleChange && (
          <div className="hidden md:flex items-center gap-0.5 text-xs">
            {(["zh", "ja", "en"] as Locale[]).map((l, i) => (
              <button
                key={l}
                onClick={() => onLocaleChange(l)}
                className={cn(
                  "px-1.5 py-0.5 font-medium transition-colors",
                  i < 2 && "border-r border-gray-200",
                  locale === l ? "text-primary font-semibold" : "text-gray-400 hover:text-gray-700"
                )}
              >
                {l === "zh" ? "中文" : l === "ja" ? "日本語" : "EN"}
              </button>
            ))}
          </div>
        )}

        {user ? (
          <>
            {/* Messages */}
            <button
              onClick={() => nav("messages")}
              className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors hidden md:flex"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Avatar + dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-8 h-8 rounded-full bg-primary-100 border border-primary/20 overflow-hidden flex items-center justify-center"
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={user.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-sm font-semibold">
                    {(user.name ?? "U")[0]}
                  </span>
                )}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-modal z-50 py-1 overflow-hidden">
                    {([
                      [L(locale, "账户", "アカウント", "Account"), "account"],
                      [L(locale, "我的订单", "予約一覧", "My Bookings"), "bookings"],
                      [L(locale, "收藏", "お気に入り", "Favorites"), "favorites"],
                    ] as [string, string][]).map(([label, page]) => (
                      <button
                        key={page}
                        onClick={() => nav(page)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 mx-3 my-1" />
                    <button
                      onClick={() => { onSignOut?.(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {L(locale, "退出", "ログアウト", "Sign out")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setAuthOpen(true)}
              className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {L(locale, "登录", "ログイン", "Log in")}
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              className="px-3.5 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {L(locale, "注册", "登録", "Sign up")}
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4 space-y-1">
          {((): [string, string][] => {
            const base: [string, string][] = [
              [L(locale, "首页", "トップ", "Home"), "list"],
              [L(locale, "房源", "物件", "Listings"), "properties"],
            ];
            if (user) {
              return [...base,
                [L(locale, "消息", "メッセージ", "Messages"), "messages"],
                [L(locale, "账户", "アカウント", "Account"), "account"],
                [L(locale, "我的订单", "予約一覧", "My Bookings"), "bookings"],
                [L(locale, "收藏", "お気に入り", "Favorites"), "favorites"],
              ];
            }
            return base;
          })().map(([label, page]) => (
            <button
              key={page}
              onClick={() => nav(page)}
              className="block w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
          {/* Mobile 登录/注册按钮 */}
          {!user && (
            <button
              onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              {L(locale, "登录 / 注册", "ログイン・登録", "Log in / Sign up")}
            </button>
          )}
          {user && (
            <>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => { onSignOut?.(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                {L(locale, "退出", "ログアウト", "Sign out")}
              </button>
            </>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title={L(locale, "登录或注册", "ログイン・登録", "Log in or sign up")}
      >
        {authModalContent}
      </AuthModal>
    </nav>
  );
}
