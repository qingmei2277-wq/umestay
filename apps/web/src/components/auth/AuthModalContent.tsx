"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { PhoneLoginForm } from "./PhoneLoginForm";
import { EmailLoginForm } from "./EmailLoginForm";

type View = "main" | "email";

export function AuthModalContent() {
  const t = useTranslations("auth");
  const pathname = usePathname();
  const [view, setView] = useState<View>("main");

  // 登录成功后跳回当前页
  const next = pathname;

  if (view === "email") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← {t("back_label")}
        </button>
        <EmailLoginForm next={next} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("welcome_label")}</h2>

      {/* 手机号 OTP（主入口） */}
      <PhoneLoginForm next={next} />

      {/* 分割线 */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{t("or_label")}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 切换到邮箱登录 */}
      <button
        onClick={() => setView("email")}
        className="w-full flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {t("continue_with_email")}
      </button>
    </div>
  );
}
