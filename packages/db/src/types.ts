// UMESTAY Database Types
//
// This file is a placeholder for auto-generated Supabase types.
//
// To generate types from your Supabase project, run:
//   supabase gen types typescript --project-id YOUR_PROJECT_ID > src/database.types.ts
//
// Then replace the Database type below with:
//   export type { Database } from "./database.types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Placeholder — replace with generated types after running supabase gen types
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
