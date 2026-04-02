"use client";

import { useState, useTransition } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { updatePasswordAction } from "@/actions/auth";

interface SettingsClientProps {
  locale: string;
  hasEmail: boolean;
  labels: {
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    signOut: string;
    dangerZone: string;
    deleteAccount: string;
    deleteConfirm: string;
  };
}

export function SettingsClient({ locale, hasEmail, labels }: SettingsClientProps) {
  const { signOut } = useUser();
  const [pending, startTransition] = useTransition();
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result?.error) {
        setPwError(result.error);
      } else {
        setPwSuccess(true);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 修改密码（仅邮箱账户） */}
      {hasEmail && (
        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{labels.changePassword}</h2>

          {pwSuccess ? (
            <p className="text-sm text-green-600">密码已更新</p>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {pwError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{pwError}</div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">{labels.newPassword}</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
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
                {pending ? "..." : labels.changePassword}
              </button>

             

            </form>
          )}
        </section>
      )}

      {/* 退出登录 */}
      <section>
        <button
          onClick={signOut}
          className="w-full bg-gray-100 text-gray-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {labels.signOut}
        </button>
      </section>

      {/* 危险区域 */}
      <section className="border border-red-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-red-600 mb-3">{labels.dangerZone}</h2>
        <button
          onClick={() => {
            if (confirm(labels.deleteConfirm)) {
              // TODO: implement account deletion via API
            }
          }}
          className="w-full border border-red-300 text-red-600 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          {labels.deleteAccount}
        </button>
      </section>
    </div>
  );
}
