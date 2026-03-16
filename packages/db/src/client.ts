import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// ─── Environment helpers ───────────────────────────────────────────────────

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// ─── Browser client (singleton for client components) ─────────────────────

export function createUmestayBrowserClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

// ─── Server client (for Server Components, Route Handlers, Server Actions) ─

export type CookieOptions = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

export type CookieMethods = {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (cookies: CookieOptions[]) => void;
};

export function createUmestayServerClient(
  cookieMethods: CookieMethods
): SupabaseClient<Database> {
  return createServerClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll: cookieMethods.getAll,
        setAll: cookieMethods.setAll,
      },
    }
  );
}

// ─── Service-role client (server-only, privileged operations) ─────────────

export function createUmestayServiceClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("SUPABASE_SERVICE_ROLE_KEY")
  );
}
