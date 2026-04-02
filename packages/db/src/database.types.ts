// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT BY HAND
//
// Regenerate after schema changes:
//   supabase gen types typescript --project-id YOUR_PROJECT_ID \
//     > packages/db/src/database.types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Placeholder until `supabase gen types` is run against the real project.
// Replace this entire file with the generated output.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          last_name: string | null;
          first_name: string | null;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          id_document_url: string | null;
          status: string;
          role: Database["public"]["Enums"]["user_role"];
          is_finance: boolean;
          preferred_lang: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          last_name?: string | null;
          first_name?: string | null;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          status?: string;
          role?: Database["public"]["Enums"]["user_role"];
          is_finance?: boolean;
          preferred_lang?: string;
        };
        Update: {
          last_name?: string | null;
          first_name?: string | null;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          status?: string;
          role?: Database["public"]["Enums"]["user_role"];
          is_finance?: boolean;
          preferred_lang?: string;
        };
      };
      host_profiles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      host_bank_accounts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      co_host_assignments: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      kyc_verifications: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      properties: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      property_images: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      amenities: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      calendar_blocks: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      management_contracts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      bookings: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      booking_status_logs: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      payments: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      host_payouts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      contracts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      invoices: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      reviews: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      messages: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      notifications: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      favorites: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      browsing_history: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      audit_logs: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
    };
    Views: Record<string, never>;
    Functions: {
      auth_role: { Args: Record<string, never>; Returns: Database["public"]["Enums"]["user_role"] };
      auth_is_finance: { Args: Record<string, never>; Returns: boolean };
      co_host_property_ids: { Args: Record<string, never>; Returns: string[] };
    };
    Enums: {
      user_role: "guest" | "host" | "co_host" | "operator" | "super_admin";
      property_type: "daily" | "monthly";
      property_status: "draft" | "active" | "inactive" | "archived";
      property_managed_by: "platform" | "host";
      booking_status:
        | "pending_payment"
        | "confirmed"
        | "checked_in"
        | "completed"
        | "reviewed"
        | "cancelled_by_guest"
        | "cancelled_by_host"
        | "cancelled_by_admin";
      payout_status: "pending" | "processing" | "paid" | "failed";
      payment_method: "stripe" | "apple_pay" | "google_pay" | "paypal" | "paypay" | "wechat" | "alipay";
      payment_status: "pending" | "processing" | "succeeded" | "failed" | "refunded" | "partially_refunded";
      kyc_status: "pending" | "approved" | "rejected";
      doc_type: "passport" | "my_number" | "residence_card" | "drivers_license";
      payout_schedule: "after_checkin" | "monthly";
      stripe_connect_status: "pending" | "active" | "restricted" | "disabled";
      host_payout_method: "stripe_connect" | "bank_transfer";
      amenity_category: "room" | "bathroom" | "kitchen" | "laundry" | "other";
      calendar_block_source: "manual" | "hostex";
      notification_type:
        | "booking_confirmed"
        | "booking_cancelled"
        | "checkin_reminder"
        | "checkout_reminder"
        | "review_invite"
        | "payout_sent"
        | "kyc_approved"
        | "kyc_rejected"
        | "message_received"
        | "contract_ready"
        | "renewal_reminder"
        | "system";
      business_type: "individual" | "company";
      deposit_status: "pending" | "held" | "released" | "forfeited";
      invoice_status: "pending" | "paid" | "overdue";
      review_status: "pending" | "published" | "hidden";
      contract_status: "draft" | "sent" | "signed" | "expired" | "terminated";
      management_contract_status: "active" | "paused" | "terminated";
    };
  };
};
