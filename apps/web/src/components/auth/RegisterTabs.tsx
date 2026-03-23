"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@umestay/ui";
import { EmailRegisterForm } from "./EmailRegisterForm";
import { PhoneRegisterForm } from "./PhoneRegisterForm";

interface RegisterTabsProps {
  next?: string;
}

export function RegisterTabs({ next }: RegisterTabsProps) {
  const t = useTranslations("auth");
  const [tab, setTab] = useState<"email" | "phone">("email");

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("email")}
          className={cn(
            "flex-1 pb-3 text-sm font-medium transition-colors",
            tab === "email"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {t("tab_email_reg")}
        </button>
        <button
          onClick={() => setTab("phone")}
          className={cn(
            "flex-1 pb-3 text-sm font-medium transition-colors",
            tab === "phone"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {t("tab_phone_reg")}
        </button>
      </div>
      {tab === "email" ? (
        <EmailRegisterForm next={next} />
      ) : (
        <PhoneRegisterForm next={next} />
      )}
    </div>
  );
}
