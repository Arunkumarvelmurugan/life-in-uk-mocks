// Launch offer: discounted pricing for the first 30 days from launch.
// Premium subscribers who sign up during this window keep the discounted
// rate for as long as their subscription stays active (Stripe subscriptions
// stay on whatever Price they were created with) - this is a permanent
// "founding member" rate, not a first-cycle-only intro price. New signups
// after the window automatically get the regular price - no manual
// follow-up needed, this just compares against the date below.
export const LAUNCH_OFFER_ENDS = new Date("2026-08-17T23:59:59Z");

export function isLaunchOfferActive(now: Date = new Date()): boolean {
  return now < LAUNCH_OFFER_ENDS;
}

export const REGULAR_PRICE_PREMIUM_GBP = 7.99;
export const REGULAR_PRICE_LIFETIME_GBP = 12.99;
export const LAUNCH_PRICE_PREMIUM_GBP = 4.99;
export const LAUNCH_PRICE_LIFETIME_GBP = 9.99;
