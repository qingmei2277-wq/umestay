"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/actions/auth";

interface ResetPasswordFormProps {
  locale: string;
  labels: {
    desc: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    success: string;
    loginLink: string;
  };
}

export function ResetPasswordForm({ locale, labels }: ResetPasswordFormProps) {
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
      }
    });
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-lg">
          {labels.success}
        </div>
        <Link href={`/${locale}/login`} className="block text-sm text-primary hover:underline">
          {labels.loginLink}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">{labels.desc}</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.emailLabel}
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={labels.emailPlaceholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : labels.submit}
      </button>
    </form>
  );
}
