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
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
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
