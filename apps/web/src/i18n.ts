import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@umestay/i18n";
import { routing } from "./navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (
    await import(`../../../packages/i18n/messages/${locale}.json`)
  ).default;

  return {
    locale,
    messages: messages as Record<string, Record<string, string>>,
  };
});
