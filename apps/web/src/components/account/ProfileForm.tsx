"use client";

import { useState } from "react";
import type { ProfileFormState } from "@/actions/profile";
import { useUser } from "@/components/providers/UserProvider";

const COUNTRY_CODES = [
  { code: "+86",  label: "+86 (中国)" },
  { code: "+81",  label: "+81 (日本)" },
  { code: "+1",   label: "+1 (美国/加拿大)" },
  { code: "+44",  label: "+44 (英国)" },
  { code: "+82",  label: "+82 (韩国)" },
  { code: "+852", label: "+852 (香港)" },
  { code: "+853", label: "+853 (澳门)" },
  { code: "+886", label: "+886 (台湾)" },
  { code: "+65",  label: "+65 (新加坡)" },
  { code: "+61",  label: "+61 (澳大利亚)" },
  { code: "+33",  label: "+33 (法国)" },
  { code: "+49",  label: "+49 (德国)" },
  { code: "+7",   label: "+7 (俄罗斯)" },
];

interface ProfileFormProps {
  locale: string;
  defaultLastName: string;
  defaultFirstName: string;
  email: string;
  countryCode: string;
  localPhone: string;
  preferredLang: string;
  langOptions: { value: string; label: string }[];
  labels: {
    lastName: string;
    firstName: string;
    nameIdHint: string;
    email: string;
    emailUpdateHint: string;
    emailVerificationSent: string;
    phone: string;
    preferredLang: string;
    save: string;
    saved: string;
  };
  updateProfile: (prev: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
}

export function ProfileForm({
  locale,
  defaultLastName,
  defaultFirstName,
  email,
  countryCode,
  localPhone,
  preferredLang,
  langOptions,
  labels,
  updateProfile,
}: ProfileFormProps) {
  const { patchProfile } = useUser();
  const [state, setState] = useState<ProfileFormState>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setState(null);
    const formData = new FormData(e.currentTarget);
    const submittedLast  = (e.currentTarget.elements.namedItem("last_name")  as HTMLInputElement)?.value ?? "";
    const submittedFirst = (e.currentTarget.elements.namedItem("first_name") as HTMLInputElement)?.value ?? "";
    try {
      const result = await updateProfile(null, formData);
      setState(result);
      if (result && "success" in result && result.success) {
        const combined = [submittedLast, submittedFirst].filter(Boolean).join(" ");
        patchProfile({ name: combined });
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      {state && "success" in state && state.success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {state.emailVerificationSent ? labels.emailVerificationSent : labels.saved}
        </div>
      )}
      {state && "error" in state && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* 姓名（与证件一致） */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {labels.fullName}
          </span>
          <span className="text-xs text-gray-400">{labels.nameIdHint}</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              id="last_name"
              name="last_name"
              type="text"
              defaultValue={defaultLastName}
              placeholder={labels.lastName}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <input
              id="first_name"
              name="first_name"
              type="text"
              defaultValue={defaultFirstName}
              placeholder={labels.firstName}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 电子邮件 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">{labels.emailUpdateHint}</p>
      </div>

      {/* 手机号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.phone}
        </label>
        <div className="flex gap-2">
          <select
            name="phone_country"
            defaultValue={countryCode}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white flex-shrink-0"
          >
            {COUNTRY_CODES.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <input
            id="phone_local"
            name="phone_local"
            type="tel"
            defaultValue={localPhone}
            placeholder="13800138000"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* 首选语言 */}
      <div>
        <label htmlFor="preferred_lang" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.preferredLang}
        </label>
        <select
          id="preferred_lang"
          name="preferred_lang"
          defaultValue={preferredLang}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white"
        >
          {langOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
      >
        {labels.save}
      </button>
    </form>
  );
}
