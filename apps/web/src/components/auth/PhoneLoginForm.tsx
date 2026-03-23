"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "./PhoneInput";
import { OtpInput } from "./OtpInput";
import { CountdownButton } from "./CountdownButton";
import { sendOtpAction, verifyOtpAction } from "@/actions/auth";

interface PhoneLoginFormProps {
  next?: string;
}

export function PhoneLoginForm({ next }: PhoneLoginFormProps) {
  const t = useTranslations("auth");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSendOtp = () => {
    if (!phone) return;
    setError(null);
    startTransition(async () => {
      const res = await sendOtpAction(phone);
      if (res?.error) {
        setError(res.error);
      } else {
        setInfo(t("otp_sent"));
        setStep("otp");
      }
    });
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("phone", phone);
    if (next) formData.set("next", next);
    startTransition(async () => {
      const result = await verifyOtpAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}
      {info && !error && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">{info}</div>
      )}

      {step === "phone" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("phone_label")}
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              defaultCountry="JP"
              disabled={pending}
            />
          </div>
          <CountdownButton
            onClick={handleSendOtp}
            disabled={!phone || pending}
            countdownLabel={(s) => t("resend_countdown", { s })}
          >
            {t("send_otp")}
          </CountdownButton>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              {t("otp_label")}
            </label>
            <OtpInput name="token" length={6} />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
          >
            {pending ? "..." : t("verify_login")}
          </button>
          <button
            type="button"
            onClick={() => { setStep("phone"); setError(null); setInfo(null); }}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            {t("back_to_phone")}
          </button>
        </form>
      )}
    </div>
  );
}
