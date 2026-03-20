"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchBar } from "@umestay/ui/composite";
import type { SearchParams } from "@umestay/ui/composite";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const router = useRouter();
  const t = useTranslations("home");

  const handleSearch = (params: SearchParams) => {
    const qs = new URLSearchParams();
    if (params.location) qs.set("q", params.location);
    if (params.checkin)  qs.set("checkin", params.checkin);
    if (params.checkout) qs.set("checkout", params.checkout);
    if (params.guests)   qs.set("guests", String(params.guests));
    router.push(`/${locale}/properties?${qs.toString()}`);
  };

  return (
    // <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
    <section className="relative min-h-[220px] flex items-center justify-center bg-stone-50">
      {/* subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
      {/* 左上角标签 */}
      <div className="absolute top-4 left-4 flex items-center">
        <img src="/logo.png" alt="Umestay" width={38} height={38} className="rounded-lg"/>
        <span className="text-lg font-bold text-stone-800">Umestay</span>
        <div className="ml-12 flex items-center gap-1.5 bg-primary-50 rounded-full px-3 py-1 text-xs font-medium text-primary-800 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block" />
          JAPAN · 日租 & 月租
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-16 text-center">
        
        {/* <h1 className="text-4xl md:text-5xl font-black text-primary-500 mb-3 leading-tight tracking-tight"> */}
        <h1 className="text-3xl md:text-4xl font-black text-primary-500 mb-8 leading-tight tracking-tight">
          {t("hero_title")}
        </h1>
        {/* <p className="text-primary-900 text-lg mb-10">{t("hero_subtitle")}</p> */}

        <div className="flex justify-center">
          <SearchBar
            onSearch={handleSearch}
            locale={locale as "zh" | "ja" | "en"}
            className="w-full max-w-[700px]"
          />
        </div>
      </div>
    </section>
  );
}
