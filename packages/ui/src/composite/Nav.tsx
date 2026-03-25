"use client";

import { useState, useEffect, useRef } from "react";
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
  const [authOpen, setAuthOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 监听全局点击，点击下拉菜单外部时关闭
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

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
          /* Avatar + dropdown，ref 绑定到整个容器 */
          <div ref={menuRef} className="relative hidden md:block">
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
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-modal z-[301] py-1.5 overflow-hidden">
                {([
                  [
                    L(locale, "消息", "メッセージ", "Messages"),
                    "messages",
                    <svg key="messages" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11h.01M16 11h.01M8 11h.01" />
                    </svg>,
                    unreadCount > 0 ? unreadCount : null,
                  ],
                  [
                    L(locale, "账户", "アカウント", "Account"),
                    "account",
                    <svg key="account" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>,
                    null,
                  ],
                  [
                    L(locale, "我的订单", "予約一覧", "My Bookings"),
                    "bookings",
                    <svg key="bookings" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>,
                    null,
                  ],
                  [
                    L(locale, "收藏", "お気に入り", "Favorites"),
                    "favorites",
                    <svg key="favorites" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>,
                    null,
                  ],
                ] as [string, string, React.ReactNode, number | null][]).map(([label, page, icon, badge]) => (
                  <button
                    key={page}
                    onClick={() => nav(page)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-gray-700 relative">
                      {icon}
                      {badge && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {badge > 9 ? "9+" : badge}
                        </span>
                      )}
                    </span>
                    {label}
                  </button>
                ))}
                <div className="h-px bg-gray-100 mx-3 my-1" />
                <button
                  onClick={() => { onSignOut?.(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {L(locale, "退出", "ログアウト", "Sign out")}
                </button>
              </div>
            )}
          </div>
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
