"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { loginAction } from "@/actions/auth";

interface EmailLoginFormProps {
  next?: string;
  onRegister?: () => void;
}

export function EmailLoginForm({ next, onRegister }: EmailLoginFormProps) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (step === "email") {
      if (!email) return;
      setStep("password");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("email", email);
    if (next) formData.set("next", next);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      {/* 邮箱 — 始终显示 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("email_label")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          readOnly={step === "password"}
          placeholder={t("email_placeholder")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none read-only:bg-gray-50 read-only:text-gray-500"
        />
      </div>

      {/* 密码 — 第二步才显示 */}
      {step === "password" && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("password_label")}
            </label>
            <Link href={`/${locale}/reset-password`} className="text-xs text-primary hover:underline">
              {t("forgot_password")}
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              autoFocus
              placeholder={t("password_placeholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : step === "email" ? t("continue") : t("login_title")}
      </button>

      {/* 第二步：返回 + 注册入口 */}
      {step === "password" && (
        <>
          <button
            type="button"
            onClick={() => { setStep("email"); setError(null); setShowPassword(false); }}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← {t("back")}
          </button>

          {onRegister && (
            <p className="text-center text-sm text-gray-500">
              {t("no_account")}{" "}
              <button
                type="button"
                onClick={onRegister}
                className="text-primary hover:underline font-medium"
              >
                {t("register_link")}
              </button>
            </p>
          )}
        </>
      )}
    </form>
  );
}
