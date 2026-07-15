import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Plan } from "@/lib/stripe";

const ACCESS_GRANTING_PREMIUM_STATUSES = ["active", "trialing", "past_due"];

interface UpsertUserInput {
  googleSub: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Called on every sign-in (see auth.ts jwt callback). Keeps the `users` row
 * in sync with the Google profile and returns its stable Supabase uuid,
 * which is what mock_test_progress rows are actually keyed on. Also reports
 * whether this row was just created, so the caller can send a welcome email
 * only on a genuine first sign-up rather than every returning sign-in.
 */
export async function upsertUser({
  googleSub,
  email,
  name,
  avatarUrl,
}: UpsertUserInput): Promise<{ userId: string; isNewUser: boolean }> {
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("google_sub", googleSub)
    .maybeSingle();
  if (lookupError) throw new Error(`Failed to look up user: ${lookupError.message}`);

  if (existing) {
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        email,
        name: name ?? null,
        avatar_url: avatarUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return { userId: existing.id as string, isNewUser: false };
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      google_sub: googleSub,
      email,
      name: name ?? null,
      avatar_url: avatarUrl ?? null,
    })
    .select("id")
    .single();

  if (error) {
    // Unique-violation on google_sub means a concurrent sign-in request
    // (e.g. a double-click) already inserted this user a moment ago -
    // treat it as an existing user rather than surfacing a spurious error.
    if (error.code === "23505") {
      const { data: raceWinner, error: refetchError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("google_sub", googleSub)
        .single();
      if (refetchError || !raceWinner) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      return { userId: raceWinner.id as string, isNewUser: false };
    }
    throw new Error(`Failed to create user: ${error.message}`);
  }
  if (!data) {
    throw new Error("Failed to create user: no row returned");
  }

  return { userId: data.id as string, isNewUser: true };
}

export interface UserAccess {
  plan: Plan;
  /** Can this user view paid tests right now. */
  hasAccess: boolean;
  premiumStatus: string | null;
  premiumCurrentPeriodEnd: string | null;
  premiumCancelAtPeriodEnd: boolean;
  /** Only Lifetime members qualify for the Pass Guarantee. */
  qualifiesForPassGuarantee: boolean;
  stripeCustomerId: string | null;
}

/**
 * The single source of truth for "what can this user do." Premium access is
 * re-derived from the stored period end on every call rather than trusting
 * premium_status alone - a defensive guard against a delayed or missed
 * subscription webhook leaving stale "active" state past the paid period.
 */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(
      "plan, premium_status, premium_current_period_end, premium_cancel_at_period_end, stripe_customer_id"
    )
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);

  const plan = (data?.plan ?? "free") as Plan;
  const premiumStatus = data?.premium_status ?? null;
  const premiumCurrentPeriodEnd = data?.premium_current_period_end ?? null;

  const isPremiumActive =
    plan === "premium" &&
    premiumStatus !== null &&
    ACCESS_GRANTING_PREMIUM_STATUSES.includes(premiumStatus) &&
    premiumCurrentPeriodEnd !== null &&
    new Date(premiumCurrentPeriodEnd).getTime() > Date.now();

  return {
    plan,
    hasAccess: plan === "lifetime" || isPremiumActive,
    premiumStatus,
    premiumCurrentPeriodEnd,
    premiumCancelAtPeriodEnd: data?.premium_cancel_at_period_end ?? false,
    qualifiesForPassGuarantee: plan === "lifetime",
    stripeCustomerId: data?.stripe_customer_id ?? null,
  };
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
