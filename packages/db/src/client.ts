import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

// ─── Environment helpers ───────────────────────────────────────────────────

// Server-side only: dynamic access works fine in Node.js (process.env is real)
function getServerEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// ─── Browser client (singleton for client components) ─────────────────────
//
// IMPORTANT: Must use LITERAL process.env.NEXT_PUBLIC_* access here.
// Next.js static replacement only works for literal property access, not
// dynamic process.env[key] access. Dynamic access resolves to undefined
// in the browser because the webpack process.env polyfill is empty.

export function createUmestayBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createBrowserClient<Database>(url, key);
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

export function createUmestayServerClient(cookieMethods: CookieMethods) {
  return createServerClient<Database>(
    getServerEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getServerEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll: cookieMethods.getAll,
        setAll: cookieMethods.setAll,
      },
    }
  );
}

// ─── Service-role client (server-only, privileged operations) ─────────────

export function createUmestayServiceClient() {
  return createBrowserClient<Database>(
    getServerEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getServerEnvVar("SUPABASE_SERVICE_ROLE_KEY")
  );
}
