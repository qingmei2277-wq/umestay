import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("nav");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-primary mb-4">UMESTAY</h1>
      <p className="text-lg text-gray-600 mb-8">
        Short-term &amp; Monthly Rentals in Japan
      </p>
      <nav className="flex gap-4">
        <a href="#" className="text-primary hover:underline">
          {t("search")}
        </a>
        <a href="#" className="text-primary hover:underline">
          {t("login")}
        </a>
        <a href="#" className="text-primary hover:underline">
          {t("register")}
        </a>
      </nav>
    </main>
  );
}
