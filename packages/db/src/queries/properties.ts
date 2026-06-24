import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

export type PropertyFilters = {
  type?: "daily" | "monthly";
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  prefecture?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  pageSize?: number;
};

export async function getProperties(client: SupabaseClient<Database>, filters: PropertyFilters = {}) {
  const { page = 1, pageSize = 20 } = filters;
  const from = (page - 1) * pageSize;

  let query = client.from("v_properties_summary")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .range(from, from + pageSize - 1);

  if (filters.type)       query = query.eq("type", filters.type);
  if (filters.minPrice)   query = query.gte("price_daily", filters.minPrice);
  if (filters.maxPrice)   query = query.lte("price_daily", filters.maxPrice);
  if (filters.guests)     query = query.gte("max_guests", filters.guests);
  if (filters.prefecture) query = query.eq("prefecture", filters.prefecture);

  switch (filters.sort) {
    case "price_asc":  query = query.order("price_daily",  { ascending: true });  break;
    case "price_desc": query = query.order("price_daily",  { ascending: false }); break;
    case "rating":     query = query.order("rating_avg",   { ascending: false }); break;
    case "newest":     query = query.order("created_at",   { ascending: false }); break;
    default:           query = query.order("rating_avg",   { ascending: false });
  }

  return query;
}

export async function getPropertyById(client: SupabaseClient<Database>, id: string) {
  return client.from("v_properties_summary")
    .select("*")
    .eq("id", id)
    .single();
}

export async function getFeaturedProperties(client: SupabaseClient<Database>, limit = 6) {
  return client.from("v_properties_summary")
    .select("*")
    .eq("status", "active")
    .order("rating_avg", { ascending: false })
    .limit(limit);
}

export interface AmenityRow {
  id: string;
  property_id: string;
  category: string;
  name: string;
  enabled: boolean;
}

export async function getPropertyAmenities(client: SupabaseClient<Database>, propertyId: string) {
  return client
    .from("amenities")
    .select("id, property_id, category, name, enabled")
    .eq("property_id", propertyId)
    .eq("enabled", true);
}

export interface ReviewRow {
  id: string;
  booking_id: string;
  reviewer_id: string;
  property_id: string;
  rating_overall: number;
  rating_clean: number | null;
  rating_location: number | null;
  rating_value: number | null;
  comment: string | null;
  host_reply: string | null;
  status: string;
  created_at: string;
}

export async function getPropertyReviews(client: SupabaseClient<Database>, propertyId: string, limit = 5) {
  return client
    .from("reviews")
    .select("id, booking_id, reviewer_id, property_id, rating_overall, rating_clean, rating_location, rating_value, comment, host_reply, status, created_at")
    .eq("property_id", propertyId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
}

export interface PropertyImageRow {
  id: string;
  property_id: string;
  url: string;
  sort_order: number;
  is_cover: boolean;
}

export async function getPropertyImages(client: SupabaseClient<Database>, propertyId: string) {
  return client
    .from("property_images")
    .select("id, property_id, url, sort_order, is_cover")
    .eq("property_id", propertyId)
    .order("sort_order");
}

export async function getBlockedDates(client: SupabaseClient<Database>, propertyId: string) {
  return client
    .from("calendar_blocks")
    .select("blocked_date")
    .eq("property_id", propertyId)
    .gte("blocked_date", new Date().toISOString().slice(0, 10));
}
