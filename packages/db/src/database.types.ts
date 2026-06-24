// ─────────────────────────────────────────────────────────────────────────────
// HAND-MAINTAINED — matches supabase/migrations/*.sql
//
// 待升级路径:将来用真实 Supabase 项目跑:
//   supabase gen types typescript --project-id YOUR_PROJECT_ID \
//     > packages/db/src/database.types.ts
// 替换本文件即可。
//
// 字段定义严格对照:
//   - 20240101000000_initial_schema_fixed.sql(主 schema)
//   - 20240102000000_view_properties_summary.sql(视图)
//   - 20240103000000_profiles_split_name.sql(profiles 加 first_name/last_name)
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // ── profiles ───────────────────────────────────────────────────────────
      profiles: {
        Row: {
          user_id: string;
          name: string | null;
          first_name: string | null; // 20240103 新增
          last_name: string | null; // 20240103 新增
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
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          id_document_url?: string | null;
          status?: string;
          role?: Database["public"]["Enums"]["user_role"];
          is_finance?: boolean;
          preferred_lang?: string;
        };
        Update: {
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          id_document_url?: string | null;
          status?: string;
          role?: Database["public"]["Enums"]["user_role"];
          is_finance?: boolean;
          preferred_lang?: string;
        };
      };

      // ── host_profiles ──────────────────────────────────────────────────────
      host_profiles: {
        Row: {
          user_id: string;
          stripe_connect_id: string | null;
          stripe_connect_status: Database["public"]["Enums"]["stripe_connect_status"];
          company_name: string | null;
          business_type: Database["public"]["Enums"]["business_type"];
          platform_fee_rate: string;
          payout_schedule: Database["public"]["Enums"]["payout_schedule"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_connect_id?: string | null;
          stripe_connect_status?: Database["public"]["Enums"]["stripe_connect_status"];
          company_name?: string | null;
          business_type?: Database["public"]["Enums"]["business_type"];
          platform_fee_rate?: string;
          payout_schedule?: Database["public"]["Enums"]["payout_schedule"];
        };
        Update: {
          stripe_connect_id?: string | null;
          stripe_connect_status?: Database["public"]["Enums"]["stripe_connect_status"];
          company_name?: string | null;
          business_type?: Database["public"]["Enums"]["business_type"];
          platform_fee_rate?: string;
          payout_schedule?: Database["public"]["Enums"]["payout_schedule"];
        };
      };

      // ── host_bank_accounts ─────────────────────────────────────────────────
      host_bank_accounts: {
        Row: {
          id: string;
          host_id: string;
          bank_name: string;
          branch_code: string | null;
          account_number: string;
          account_holder: string;
          currency: string;
          is_default: boolean;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          bank_name: string;
          branch_code?: string | null;
          account_number: string;
          account_holder: string;
          currency?: string;
          is_default?: boolean;
          verified?: boolean;
        };
        Update: {
          bank_name?: string;
          branch_code?: string | null;
          account_number?: string;
          account_holder?: string;
          currency?: string;
          is_default?: boolean;
          verified?: boolean;
        };
      };

      // ── co_host_assignments ────────────────────────────────────────────────
      co_host_assignments: {
        Row: {
          id: string;
          co_host_id: string;
          property_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          co_host_id: string;
          property_id: string;
          assigned_by?: string | null;
        };
        Update: {
          co_host_id?: string;
          property_id?: string;
          assigned_by?: string | null;
        };
      };

      // ── kyc_verifications ──────────────────────────────────────────────────
      kyc_verifications: {
        Row: {
          id: string;
          user_id: string;
          doc_type: Database["public"]["Enums"]["doc_type"];
          doc_url: string;
          status: Database["public"]["Enums"]["kyc_status"];
          reviewer_id: string | null;
          reviewed_at: string | null;
          reject_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          doc_type: Database["public"]["Enums"]["doc_type"];
          doc_url: string;
          status?: Database["public"]["Enums"]["kyc_status"];
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          reject_reason?: string | null;
        };
        Update: {
          doc_type?: Database["public"]["Enums"]["doc_type"];
          doc_url?: string;
          status?: Database["public"]["Enums"]["kyc_status"];
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          reject_reason?: string | null;
        };
      };

      // ── properties ─────────────────────────────────────────────────────────
      properties: {
        Row: {
          id: string;
          owner_id: string | null;
          managed_by: Database["public"]["Enums"]["property_managed_by"];
          management_fee_rate: string | null;
          title_zh: string;
          title_ja: string | null;
          title_en: string | null;
          description_zh: string | null;
          description_ja: string | null;
          description_en: string | null;
          type: Database["public"]["Enums"]["property_type"];
          status: Database["public"]["Enums"]["property_status"];
          area_sqm: string | null;
          max_guests: number;
          floor: number | null;
          price_daily: string | null;
          price_monthly: string | null;
          cleaning_fee: string;
          deposit_amount: string;
          location: string | null; // geography(Point,4326) — 前端通过视图的 lat/lng 使用
          prefecture: string | null;
          city: string | null;
          address_detail: string | null;
          nearest_station: string | null;
          station_walk_min: number | null;
          license_number: string | null;
          license_expires_at: string | null;
          checkin_time: string | null;
          checkout_time: string | null;
          checkin_method: string | null;
          cancellation_policy: string | null;
          house_rules: string | null;
          rating_avg: string;
          review_count: number;
          published_at: string | null;
          scheduled_publish_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          managed_by?: Database["public"]["Enums"]["property_managed_by"];
          management_fee_rate?: string | null;
          title_zh: string;
          title_ja?: string | null;
          title_en?: string | null;
          description_zh?: string | null;
          description_ja?: string | null;
          description_en?: string | null;
          type: Database["public"]["Enums"]["property_type"];
          status?: Database["public"]["Enums"]["property_status"];
          area_sqm?: string | null;
          max_guests: number;
          floor?: number | null;
          price_daily?: string | null;
          price_monthly?: string | null;
          cleaning_fee?: string;
          deposit_amount?: string;
          location?: string | null;
          prefecture?: string | null;
          city?: string | null;
          address_detail?: string | null;
          nearest_station?: string | null;
          station_walk_min?: number | null;
          license_number?: string | null;
          license_expires_at?: string | null;
          checkin_time?: string | null;
          checkout_time?: string | null;
          checkin_method?: string | null;
          cancellation_policy?: string | null;
          house_rules?: string | null;
          rating_avg?: string;
          review_count?: number;
          published_at?: string | null;
          scheduled_publish_at?: string | null;
        };
        Update: {
          owner_id?: string | null;
          managed_by?: Database["public"]["Enums"]["property_managed_by"];
          management_fee_rate?: string | null;
          title_zh?: string;
          title_ja?: string | null;
          title_en?: string | null;
          description_zh?: string | null;
          description_ja?: string | null;
          description_en?: string | null;
          type?: Database["public"]["Enums"]["property_type"];
          status?: Database["public"]["Enums"]["property_status"];
          area_sqm?: string | null;
          max_guests?: number;
          floor?: number | null;
          price_daily?: string | null;
          price_monthly?: string | null;
          cleaning_fee?: string;
          deposit_amount?: string;
          location?: string | null;
          prefecture?: string | null;
          city?: string | null;
          address_detail?: string | null;
          nearest_station?: string | null;
          station_walk_min?: number | null;
          license_number?: string | null;
          license_expires_at?: string | null;
          checkin_time?: string | null;
          checkout_time?: string | null;
          checkin_method?: string | null;
          cancellation_policy?: string | null;
          house_rules?: string | null;
          rating_avg?: string;
          review_count?: number;
          published_at?: string | null;
          scheduled_publish_at?: string | null;
        };
      };

      // ── property_images ────────────────────────────────────────────────────
      property_images: {
        Row: {
          id: string;
          property_id: string;
          url: string;
          storage_path: string | null;
          sort_order: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          url: string;
          storage_path?: string | null;
          sort_order?: number;
          is_cover?: boolean;
        };
        Update: {
          url?: string;
          storage_path?: string | null;
          sort_order?: number;
          is_cover?: boolean;
        };
      };

      // ── amenities ──────────────────────────────────────────────────────────
      amenities: {
        Row: {
          id: string;
          property_id: string;
          category: Database["public"]["Enums"]["amenity_category"];
          name: string;
          enabled: boolean;
        };
        Insert: {
          id?: string;
          property_id: string;
          category: Database["public"]["Enums"]["amenity_category"];
          name: string;
          enabled?: boolean;
        };
        Update: {
          category?: Database["public"]["Enums"]["amenity_category"];
          name?: string;
          enabled?: boolean;
        };
      };

      // ── calendar_blocks ────────────────────────────────────────────────────
      calendar_blocks: {
        Row: {
          id: string;
          property_id: string;
          blocked_date: string;
          source: Database["public"]["Enums"]["calendar_block_source"];
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          blocked_date: string;
          source?: Database["public"]["Enums"]["calendar_block_source"];
          note?: string | null;
        };
        Update: {
          source?: Database["public"]["Enums"]["calendar_block_source"];
          note?: string | null;
        };
      };

      // ── management_contracts ───────────────────────────────────────────────
      management_contracts: {
        Row: {
          id: string;
          property_id: string;
          host_id: string;
          management_fee_rate: string;
          revenue_share_rate: string;
          contract_start: string;
          contract_end: string | null;
          auto_renew: boolean;
          status: Database["public"]["Enums"]["management_contract_status"];
          pdf_url: string | null;
          signed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          host_id: string;
          management_fee_rate: string;
          revenue_share_rate: string;
          contract_start: string;
          contract_end?: string | null;
          auto_renew?: boolean;
          status?: Database["public"]["Enums"]["management_contract_status"];
          pdf_url?: string | null;
          signed_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          management_fee_rate?: string;
          revenue_share_rate?: string;
          contract_start?: string;
          contract_end?: string | null;
          auto_renew?: boolean;
          status?: Database["public"]["Enums"]["management_contract_status"];
          pdf_url?: string | null;
          signed_at?: string | null;
        };
      };

      // ── bookings ───────────────────────────────────────────────────────────
      bookings: {
        Row: {
          id: string;
          property_id: string;
          user_id: string;
          checkin: string;
          checkout: string;
          guests: number;
          status: Database["public"]["Enums"]["booking_status"];
          room_fee: string;
          cleaning_fee: string;
          platform_fee: string;
          total_price: string;
          host_payout_amount: string | null;
          payout_status: Database["public"]["Enums"]["payout_status"];
          cancelled_at: string | null;
          cancellation_reason: string | null;
          refund_amount: string | null;
          guest_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          user_id: string;
          checkin: string;
          checkout: string;
          guests: number;
          status?: Database["public"]["Enums"]["booking_status"];
          room_fee: string;
          cleaning_fee?: string;
          platform_fee?: string;
          total_price: string;
          host_payout_amount?: string | null;
          payout_status?: Database["public"]["Enums"]["payout_status"];
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          refund_amount?: string | null;
          guest_note?: string | null;
        };
        Update: {
          status?: Database["public"]["Enums"]["booking_status"];
          room_fee?: string;
          cleaning_fee?: string;
          platform_fee?: string;
          total_price?: string;
          host_payout_amount?: string | null;
          payout_status?: Database["public"]["Enums"]["payout_status"];
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          refund_amount?: string | null;
          guest_note?: string | null;
        };
      };

      // ── booking_status_logs ────────────────────────────────────────────────
      booking_status_logs: {
        Row: {
          id: string;
          booking_id: string;
          from_status: Database["public"]["Enums"]["booking_status"] | null;
          to_status: Database["public"]["Enums"]["booking_status"];
          actor_id: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          from_status?: Database["public"]["Enums"]["booking_status"] | null;
          to_status: Database["public"]["Enums"]["booking_status"];
          actor_id?: string | null;
          reason?: string | null;
        };
        Update: {
          from_status?: Database["public"]["Enums"]["booking_status"] | null;
          to_status?: Database["public"]["Enums"]["booking_status"];
          actor_id?: string | null;
          reason?: string | null;
        };
      };

      // ── payments ───────────────────────────────────────────────────────────
      payments: {
        Row: {
          id: string;
          booking_id: string;
          amount: string;
          currency: string;
          method: Database["public"]["Enums"]["payment_method"];
          status: Database["public"]["Enums"]["payment_status"];
          stripe_id: string | null;
          gateway_ref: string | null;
          refund_id: string | null;
          refunded_at: string | null;
          refund_amount: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          amount: string;
          currency?: string;
          method: Database["public"]["Enums"]["payment_method"];
          status?: Database["public"]["Enums"]["payment_status"];
          stripe_id?: string | null;
          gateway_ref?: string | null;
          refund_id?: string | null;
          refunded_at?: string | null;
          refund_amount?: string | null;
        };
        Update: {
          amount?: string;
          currency?: string;
          method?: Database["public"]["Enums"]["payment_method"];
          status?: Database["public"]["Enums"]["payment_status"];
          stripe_id?: string | null;
          gateway_ref?: string | null;
          refund_id?: string | null;
          refunded_at?: string | null;
          refund_amount?: string | null;
        };
      };

      // ── host_payouts ───────────────────────────────────────────────────────
      host_payouts: {
        Row: {
          id: string;
          host_id: string;
          booking_ids: Json; // jsonb 数组,格式 ["uuid1","uuid2"]
          amount: string;
          platform_fee: string;
          net_amount: string;
          currency: string;
          status: Database["public"]["Enums"]["payout_status"];
          payout_method: Database["public"]["Enums"]["host_payout_method"];
          stripe_transfer_id: string | null;
          bank_account_id: string | null;
          note: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          booking_ids?: Json;
          amount: string;
          platform_fee?: string;
          net_amount: string;
          currency?: string;
          status?: Database["public"]["Enums"]["payout_status"];
          payout_method?: Database["public"]["Enums"]["host_payout_method"];
          stripe_transfer_id?: string | null;
          bank_account_id?: string | null;
          note?: string | null;
          paid_at?: string | null;
        };
        Update: {
          booking_ids?: Json;
          amount?: string;
          platform_fee?: string;
          net_amount?: string;
          currency?: string;
          status?: Database["public"]["Enums"]["payout_status"];
          payout_method?: Database["public"]["Enums"]["host_payout_method"];
          stripe_transfer_id?: string | null;
          bank_account_id?: string | null;
          note?: string | null;
          paid_at?: string | null;
        };
      };

      // ── contracts ──────────────────────────────────────────────────────────
      contracts: {
        Row: {
          id: string;
          booking_id: string;
          status: Database["public"]["Enums"]["contract_status"];
          pdf_url: string | null;
          signed_at: string | null;
          start_date: string | null;
          end_date: string | null;
          deposit_amount: string;
          deposit_status: Database["public"]["Enums"]["deposit_status"];
          deposit_paid_at: string | null;
          deposit_released_at: string | null;
          renewal_reminded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          status?: Database["public"]["Enums"]["contract_status"];
          pdf_url?: string | null;
          signed_at?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          deposit_amount?: string;
          deposit_status?: Database["public"]["Enums"]["deposit_status"];
          deposit_paid_at?: string | null;
          deposit_released_at?: string | null;
          renewal_reminded_at?: string | null;
        };
        Update: {
          status?: Database["public"]["Enums"]["contract_status"];
          pdf_url?: string | null;
          signed_at?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          deposit_amount?: string;
          deposit_status?: Database["public"]["Enums"]["deposit_status"];
          deposit_paid_at?: string | null;
          deposit_released_at?: string | null;
          renewal_reminded_at?: string | null;
        };
      };

      // ── invoices ───────────────────────────────────────────────────────────
      invoices: {
        Row: {
          id: string;
          contract_id: string;
          billing_month: string;
          amount: string;
          status: Database["public"]["Enums"]["invoice_status"];
          pdf_url: string | null;
          paid_at: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          billing_month: string;
          amount: string;
          status?: Database["public"]["Enums"]["invoice_status"];
          pdf_url?: string | null;
          paid_at?: string | null;
          due_date?: string | null;
        };
        Update: {
          amount?: string;
          status?: Database["public"]["Enums"]["invoice_status"];
          pdf_url?: string | null;
          paid_at?: string | null;
          due_date?: string | null;
        };
      };

      // ── reviews ────────────────────────────────────────────────────────────
      reviews: {
        Row: {
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
          host_replied_at: string | null;
          status: Database["public"]["Enums"]["review_status"];
          published_at: string | null;
          invite_sent_at: string | null;
          invite_expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          property_id: string;
          rating_overall: number;
          rating_clean?: number | null;
          rating_location?: number | null;
          rating_value?: number | null;
          comment?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          published_at?: string | null;
          invite_sent_at?: string | null;
          invite_expires_at?: string | null;
        };
        Update: {
          rating_overall?: number;
          rating_clean?: number | null;
          rating_location?: number | null;
          rating_value?: number | null;
          comment?: string | null;
          host_reply?: string | null;
          host_replied_at?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          published_at?: string | null;
        };
      };

      // ── messages ───────────────────────────────────────────────────────────
      messages: {
        Row: {
          id: string;
          booking_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: {
          content?: string;
          read_at?: string | null;
        };
      };

      // ── notifications ──────────────────────────────────────────────────────
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: Database["public"]["Enums"]["notification_type"];
          title: string | null;
          content: string | null;
          related_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Database["public"]["Enums"]["notification_type"];
          title?: string | null;
          content?: string | null;
          related_id?: string | null;
          read_at?: string | null;
        };
        Update: {
          type?: Database["public"]["Enums"]["notification_type"];
          title?: string | null;
          content?: string | null;
          related_id?: string | null;
          read_at?: string | null;
        };
      };

      // ── favorites(复合主键,无 id 列)──────────────────────────────────────
      favorites: {
        Row: {
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          property_id: string;
        };
        Update: Record<string, never>; // 复合主键,无可更新字段
      };

      // ── browsing_history ───────────────────────────────────────────────────
      browsing_history: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          viewed_at?: string;
        };
        Update: {
          viewed_at?: string;
        };
      };

      // ── audit_logs ─────────────────────────────────────────────────────────
      audit_logs: {
        Row: {
          id: string;
          action: string;
          actor_id: string | null;
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          actor_id?: string | null;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
        };
        Update: {
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
        };
      };
    };

    // ── Views ─────────────────────────────────────────────────────────────────
    Views: {
      v_properties_summary: {
        Row: {
          id: string;
          owner_id: string | null;
          managed_by: Database["public"]["Enums"]["property_managed_by"];
          type: Database["public"]["Enums"]["property_type"];
          status: Database["public"]["Enums"]["property_status"];
          title_zh: string;
          title_ja: string | null;
          title_en: string | null;
          description_zh: string | null;
          description_ja: string | null;
          description_en: string | null;
          prefecture: string | null;
          city: string | null;
          nearest_station: string | null;
          station_walk_min: number | null;
          lat: number | null; // st_y(location::geometry)
          lng: number | null; // st_x(location::geometry)
          price_daily: string | null;
          price_monthly: string | null;
          cleaning_fee: string;
          deposit_amount: string;
          max_guests: number;
          area_sqm: string | null;
          floor: number | null;
          license_number: string | null;
          license_expires_at: string | null;
          checkin_time: string | null;
          checkout_time: string | null;
          checkin_method: string | null;
          cancellation_policy: string | null;
          house_rules: string | null;
          rating_avg: string;
          review_count: number;
          cover_image_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };

    // ── Functions(RPC)──────────────────────────────────────────────────────
    Functions: {
      auth_role: {
        Args: Record<string, never>;
        Returns: Database["public"]["Enums"]["user_role"];
      };
      auth_is_finance: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      co_host_property_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
    };

    // ── Enums ────────────────────────────────────────────────────────────────
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
      payment_method:
        | "stripe"
        | "apple_pay"
        | "google_pay"
        | "paypal"
        | "paypay"
        | "wechat"
        | "alipay";
      payment_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "refunded"
        | "partially_refunded";
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
