"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { resetPasswordAction } from "@/actions/auth";

interface ResetPasswordFormProps {
  onBack?: () => void;  // 弹框内使用时传入，成功后返回登录
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onBack, onSuccess }: ResetPasswordFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        onSuccess?.();
      }
    });
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-lg">
          {t("reset_email_sent")}
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="block w-full text-sm text-primary hover:underline"
          >
            {t("back_to_login")}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-sm text-gray-500">{t("reset_password_desc")}</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("email_label")}
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("email_placeholder")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : t("reset_password_submit")}
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← {t("back")}
        </button>
      )}
    </form>
  );
}
