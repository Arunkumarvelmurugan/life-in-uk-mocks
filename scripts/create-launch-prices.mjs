// One-off setup script: creates the discounted 30-day launch-offer Stripe
// Prices for Premium and Lifetime, alongside (not replacing) the regular
// prices - src/lib/checkout-actions.ts picks between them automatically
// based on src/lib/pricing.ts's LAUNCH_OFFER_ENDS date.
//
// Run once per Stripe mode: `node --env-file=.env.local scripts/create-launch-prices.mjs`
// Paste the printed Price IDs into STRIPE_PRICE_PREMIUM_LAUNCH /
// STRIPE_PRICE_LIFETIME_LAUNCH (in .env.local for testing, and in Vercel's
// project environment variables for production - this must be run again
// with your LIVE secret key to get live-mode IDs for the real site).
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const premiumProduct = await stripe.products.create({
  name: "Life in UK Mocks - Premium (Launch Offer)",
  description: "Launch-offer price for the first 30 days - all 17 mock tests, unlimited retakes, renews every 30 days.",
});
const premiumPrice = await stripe.prices.create({
  product: premiumProduct.id,
  currency: "gbp",
  unit_amount: 499,
  recurring: { interval: "day", interval_count: 30 },
});

const lifetimeProduct = await stripe.products.create({
  name: "Life in UK Mocks - Lifetime Access (Launch Offer)",
  description: "Launch-offer price for the first 30 days - all 17 mock tests, unlimited retakes, and the Pass Guarantee, forever.",
});
const lifetimePrice = await stripe.prices.create({
  product: lifetimeProduct.id,
  currency: "gbp",
  unit_amount: 999,
});

console.log("Premium (launch) product:", premiumProduct.id);
console.log("Premium (launch) price:  ", premiumPrice.id);
console.log("Lifetime (launch) product:", lifetimeProduct.id);
console.log("Lifetime (launch) price:  ", lifetimePrice.id);
console.log("\nAdd to .env.local / Vercel:");
console.log(`STRIPE_PRICE_PREMIUM_LAUNCH=${premiumPrice.id}`);
console.log(`STRIPE_PRICE_LIFETIME_LAUNCH=${lifetimePrice.id}`);
