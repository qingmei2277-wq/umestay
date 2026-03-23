"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { loginAction } from "@/actions/auth";

interface EmailLoginFormProps {
  next?: string;
}

export function EmailLoginForm({ next }: EmailLoginFormProps) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    if (next) formData.set("next", next);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

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
          placeholder={t("email_placeholder")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t("password_label")}
          </label>
          <Link
            href={`/${locale}/reset-password`}
            className="text-xs text-primary hover:underline"
          >
            {t("forgot_password")}
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={t("password_placeholder")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : t("login_title")}
      </button>
    </form>
  );
}
