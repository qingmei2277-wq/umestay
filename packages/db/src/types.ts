// ─── Auto-generated types ─────────────────────────────────────────────────────
//
// Run the following to regenerate after schema changes:
//   supabase gen types typescript --project-id YOUR_PROJECT_ID \
//     > packages/db/src/database.types.ts
//
// ─────────────────────────────────────────────────────────────────────────────

export type { Database, Json } from "./database.types";
import type { Database } from "./database.types";

// ── Core table row types ───────────────────────────────────────────────────────

export type Profile          = Database["public"]["Tables"]["profiles"]["Row"];
export type Property         = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyImage    = Database["public"]["Tables"]["property_images"]["Row"];
export type Amenity          = Database["public"]["Tables"]["amenities"]["Row"];
export type CalendarBlock    = Database["public"]["Tables"]["calendar_blocks"]["Row"];
export type Booking          = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingStatusLog = Database["public"]["Tables"]["booking_status_logs"]["Row"];
export type Payment          = Database["public"]["Tables"]["payments"]["Row"];
export type Contract         = Database["public"]["Tables"]["contracts"]["Row"];
export type Invoice          = Database["public"]["Tables"]["invoices"]["Row"];
export type Review           = Database["public"]["Tables"]["reviews"]["Row"];
export type Message          = Database["public"]["Tables"]["messages"]["Row"];
export type Notification     = Database["public"]["Tables"]["notifications"]["Row"];
export type Favorite         = Database["public"]["Tables"]["favorites"]["Row"];
export type BrowsingHistory  = Database["public"]["Tables"]["browsing_history"]["Row"];
export type AuditLog         = Database["public"]["Tables"]["audit_logs"]["Row"];

// ── Host & management table types ─────────────────────────────────────────────

export type HostProfile          = Database["public"]["Tables"]["host_profiles"]["Row"];
export type HostBankAccount      = Database["public"]["Tables"]["host_bank_accounts"]["Row"];
export type HostPayout           = Database["public"]["Tables"]["host_payouts"]["Row"];
export type CoHostAssignment     = Database["public"]["Tables"]["co_host_assignments"]["Row"];
export type KycVerification      = Database["public"]["Tables"]["kyc_verifications"]["Row"];
export type ManagementContract   = Database["public"]["Tables"]["management_contracts"]["Row"];

// ── Insert types ──────────────────────────────────────────────────────────────

export type ProfileInsert            = Database["public"]["Tables"]["profiles"]["Insert"];
export type PropertyInsert           = Database["public"]["Tables"]["properties"]["Insert"];
export type BookingInsert            = Database["public"]["Tables"]["bookings"]["Insert"];
export type PaymentInsert            = Database["public"]["Tables"]["payments"]["Insert"];
export type KycVerificationInsert    = Database["public"]["Tables"]["kyc_verifications"]["Insert"];
export type CoHostAssignmentInsert   = Database["public"]["Tables"]["co_host_assignments"]["Insert"];
export type ManagementContractInsert = Database["public"]["Tables"]["management_contracts"]["Insert"];

// ── Update types ──────────────────────────────────────────────────────────────

export type ProfileUpdate  = Database["public"]["Tables"]["profiles"]["Update"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];
export type BookingUpdate  = Database["public"]["Tables"]["bookings"]["Update"];

// ── Enum types ────────────────────────────────────────────────────────────────

export type UserRole                 = Database["public"]["Enums"]["user_role"];
export type PropertyType             = Database["public"]["Enums"]["property_type"];
export type PropertyStatus           = Database["public"]["Enums"]["property_status"];
export type PropertyManagedBy        = Database["public"]["Enums"]["property_managed_by"];
export type BookingStatus            = Database["public"]["Enums"]["booking_status"];
export type PaymentMethod            = Database["public"]["Enums"]["payment_method"];
export type PaymentStatus            = Database["public"]["Enums"]["payment_status"];
export type PayoutStatus             = Database["public"]["Enums"]["payout_status"];
export type HostPayoutMethod         = Database["public"]["Enums"]["host_payout_method"];
export type PayoutSchedule           = Database["public"]["Enums"]["payout_schedule"];
export type StripeConnectStatus      = Database["public"]["Enums"]["stripe_connect_status"];
export type BusinessType             = Database["public"]["Enums"]["business_type"];
export type KycStatus                = Database["public"]["Enums"]["kyc_status"];
export type DocType                  = Database["public"]["Enums"]["doc_type"];
export type DepositStatus            = Database["public"]["Enums"]["deposit_status"];
export type InvoiceStatus            = Database["public"]["Enums"]["invoice_status"];
export type ContractStatus           = Database["public"]["Enums"]["contract_status"];
export type ManagementContractStatus = Database["public"]["Enums"]["management_contract_status"];
export type ReviewStatus             = Database["public"]["Enums"]["review_status"];
export type NotificationType         = Database["public"]["Enums"]["notification_type"];
export type AmenityCategory          = Database["public"]["Enums"]["amenity_category"];
export type CalendarBlockSource      = Database["public"]["Enums"]["calendar_block_source"];
