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
  defaultName: string;
  countryCode: string;
  localPhone: string;
  preferredLang: string;
  langOptions: { value: string; label: string }[];
  labels: {
    name: string;
    phone: string;
    preferredLang: string;
    save: string;
    saved: string;
  };
  updateProfile: (prev: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
}

export function ProfileForm({
  locale,
  defaultName,
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
    const submittedName = (e.currentTarget.elements.namedItem("name") as HTMLInputElement)?.value;
    try {
      const result = await updateProfile(null, formData);
      setState(result);
      if (result && "success" in result && result.success) {
        patchProfile({ name: submittedName });
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
          {labels.saved}
        </div>
      )}
      {state && "error" in state && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={defaultName}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

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
