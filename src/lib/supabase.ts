import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only admin client. Uses the Supabase "secret" key, which bypasses
// Row Level Security — this file must never be imported from a Client
// Component. All access control happens in the Server Actions that use it,
// which scope every query to the authenticated user's id.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.AUTH_SUPABASE_SECRET!,
  { auth: { persistSession: false } }
);
