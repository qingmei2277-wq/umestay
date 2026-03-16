import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@umestay/i18n";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const messages = (
    await import(`../../../packages/i18n/messages/${locale}.json`)
  ).default;

  return {
    messages: messages as Record<string, Record<string, string>>,
  };
});
