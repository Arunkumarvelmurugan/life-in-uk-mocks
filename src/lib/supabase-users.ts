import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

interface UpsertUserInput {
  googleSub: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Called on every sign-in (see auth.ts jwt callback). Keeps the `users` row
 * in sync with the Google profile and returns its stable Supabase uuid,
 * which is what mock_test_progress rows are actually keyed on.
 */
export async function upsertUser({ googleSub, email, name, avatarUrl }: UpsertUserInput) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        google_sub: googleSub,
        email,
        name: name ?? null,
        avatar_url: avatarUrl ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "google_sub" }
    )
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to upsert user: ${error?.message}`);
  }

  return data.id as string;
}

export async function getUserHasFullAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("has_full_access")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.has_full_access ?? false;
}

/**
 * The user-editable display name, falling back to the name Google reported
 * at sign-in if they haven't set one. `display_name` is never touched by
 * the sign-in upsert, so an edit here survives future logins.
 */
export async function getUserDisplayName(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("display_name, name")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.display_name ?? data?.name ?? null;
}
