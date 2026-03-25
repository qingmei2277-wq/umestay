"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updatePasswordAction } from "@/actions/auth";

export function UpdatePasswordForm({ tokenHash }: { tokenHash?: string }) {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result?.error) setError(result.error);
      // 成功时 updatePasswordAction 内部会 redirect
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {tokenHash && <input type="hidden" name="token_hash" value={tokenHash} />}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("new_password_label")}
        </label>
        <div className="relative">
          <input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
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

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : t("update_password")}
      </button>
    </form>
  );
}
