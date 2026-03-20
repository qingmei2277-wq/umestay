import { Photo } from "../atoms/Photo";
import { Stars } from "../atoms/Stars";
import { FavBtn } from "../atoms/FavBtn";
import { TypeTag, FeaturedTag } from "../atoms/Tag";
import { cn } from "../utils/cn";

export interface PropertySummary {
  id: string;
  type: "daily" | "monthly";
  title_zh: string;
  title_ja?: string | null;
  title_en?: string | null;
  cover_image_url?: string | null;
  city?: string | null;
  price_daily?: number | null;
  price_monthly?: number | null;
  rating_avg?: number;
  review_count?: number;
  is_featured?: boolean;
}

interface PropertyCardProps {
  property: PropertySummary;
  locale?: "zh" | "ja" | "en";
  href?: string;
  onFavToggle?: (faved: boolean, id: string) => Promise<void>;
  isFaved?: boolean;
  className?: string;
}

export function PropertyCard({
  property,
  locale = "zh",
  href,
  onFavToggle,
  isFaved,
  className,
}: PropertyCardProps) {
  const title =
    (locale === "ja" ? property.title_ja : locale === "en" ? property.title_en : property.title_zh) ??
    property.title_zh ??
    property.title_ja ??
    property.title_en ??
    "";

  const price =
    property.type === "monthly"
      ? `¥${property.price_monthly?.toLocaleString() ?? "–"}/月`
      : `¥${property.price_daily?.toLocaleString() ?? "–"}/泊`;

  const inner = (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-white shadow-card hover:shadow-hover transition-shadow cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative">
        <Photo
          {...(property.cover_image_url ? { src: property.cover_image_url } : {})}
          alt={title}
          aspectRatio="4/3"
          className="group-hover:scale-105 transition-transform duration-300"
        >
          <div className="absolute top-2 left-2 z-10">
            <TypeTag type={property.type} locale={locale} />
          </div>
        </Photo>
        <div className="absolute top-2 right-2 z-10">
          <FavBtn
            propertyId={property.id}
            {...(isFaved !== undefined ? { initialFaved: isFaved } : {})}
            {...(onFavToggle ? { onToggle: onFavToggle } : {})}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          {property.is_featured && <FeaturedTag />}
        </div>
        <h3 className="font-medium text-gray-900 line-clamp-1 text-sm">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{property.city}</span>
          {(property.rating_avg ?? 0) > 0 && (
            <Stars
              rating={property.rating_avg ?? 0}
              {...(property.review_count !== undefined ? { count: property.review_count } : {})}
              size="sm"
            />
          )}
        </div>
        <div className="mt-2 font-semibold text-gray-900 text-sm">{price}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  }
  return inner;
}
