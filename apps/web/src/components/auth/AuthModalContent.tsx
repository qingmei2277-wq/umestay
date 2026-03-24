"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { PhoneLoginForm } from "./PhoneLoginForm";
import { EmailLoginForm } from "./EmailLoginForm";
import { EmailRegisterForm } from "./EmailRegisterForm";

type View = "main" | "phone" | "email-register";

export function AuthModalContent() {
  const t = useTranslations("auth");
  const pathname = usePathname();
  const [view, setView] = useState<View>("main");

  const next = pathname;

  if (view === "phone") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← {t("back_label")}
        </button>
        <PhoneLoginForm next={next} />
      </div>
    );
  }

  if (view === "email-register") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← {t("back_label")}
        </button>
        <EmailRegisterForm next={next} />
        <p className="text-center text-sm text-gray-500">
          {t("has_account")}{" "}
          <button
            onClick={() => setView("main")}
            className="text-primary hover:underline font-medium"
          >
            {t("login_link")}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("welcome_label")}</h2>

      {/* 邮箱登录（主入口），密码步骤时显示注册入口 */}
      <EmailLoginForm
        next={next}
        onRegister={() => setView("email-register")}
      />

      {/* 分割线 */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{t("or_label")}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 切换到手机号 OTP */}
      <button
        onClick={() => setView("phone")}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        {t("continue_with_phone")}
      </button>
    </div>
  );
}
