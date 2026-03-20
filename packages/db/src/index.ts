export {
  createUmestayBrowserClient,
  createUmestayServerClient,
  createUmestayServiceClient,
} from "./client";

export type { Database, Json } from "./types";
export type { CookieMethods, CookieOptions } from "./client";

export {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  getPropertyAmenities,
  getPropertyReviews,
  getPropertyImages,
  getBlockedDates,
} from "./queries/properties";
export type {
  PropertySummaryRow,
  PropertyFilters,
  AmenityRow,
  ReviewRow,
  PropertyImageRow,
} from "./queries/properties";
