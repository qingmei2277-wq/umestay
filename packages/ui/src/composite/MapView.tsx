"use client";

// MapView requires SSR to be disabled when used in Next.js:
//   const MapView = dynamic(() => import("@umestay/ui/composite").then(m => m.MapView), { ssr: false });

type Locale = "zh" | "ja" | "en";

export interface MapProperty {
  id: string;
  lat: number;
  lng: number;
  daily_price?: number | null;
  monthly_price?: number | null;
  type?: "daily" | "monthly";
}

interface MapViewProps {
  properties: MapProperty[];
  center?: { lat: number; lng: number };
  selectedId?: string;
  onPropertyClick?: (id: string) => void;
  locale?: Locale;
  apiKey?: string;
}

const DEFAULT_CENTER = { lat: 35.6895, lng: 139.6917 };

export function MapView({
  properties,
  center = DEFAULT_CENTER,
  selectedId,
  onPropertyClick,
  locale = "zh",
  apiKey,
}: MapViewProps) {
  // Google Maps embed — replace with @react-google-maps/api for interactive markers
  const lang = locale === "ja" ? "ja" : "en";
  const src =
    `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d25945!2d${center.lng}!3d${center.lat}` +
    `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${lang}!2sjp!4v1699999999999`;

  // Suppress unused var warnings in TS
  void properties; void selectedId; void onPropertyClick; void apiKey;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200">
      <iframe
        src={src}
        className="w-full h-full border-none"
        title="Google Maps"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200 text-xs text-gray-500 font-medium">
        Google Maps
      </div>
    </div>
  );
}
