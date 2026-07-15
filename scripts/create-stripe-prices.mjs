// One-off setup script: creates the Premium (recurring) and Lifetime
// (one-time) Stripe Products/Prices for the new three-tier pricing model.
// Run once per Stripe mode: `node --env-file=.env.local scripts/create-stripe-prices.mjs`
// Paste the printed Price IDs into STRIPE_PRICE_PREMIUM / STRIPE_PRICE_LIFETIME.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const premiumProduct = await stripe.products.create({
  name: "Life in UK Mocks - Premium",
  description: "All 17 mock tests, unlimited retakes - renews every 30 days.",
});
const premiumPrice = await stripe.prices.create({
  product: premiumProduct.id,
  currency: "gbp",
  unit_amount: 799,
  recurring: { interval: "day", interval_count: 30 },
});

const lifetimeProduct = await stripe.products.create({
  name: "Life in UK Mocks - Lifetime Access",
  description: "All 17 mock tests, unlimited retakes, and the Pass Guarantee - forever.",
});
const lifetimePrice = await stripe.prices.create({
  product: lifetimeProduct.id,
  currency: "gbp",
  unit_amount: 1299,
});

console.log("Premium product:", premiumProduct.id);
console.log("Premium price:  ", premiumPrice.id);
console.log("Lifetime product:", lifetimeProduct.id);
console.log("Lifetime price:  ", lifetimePrice.id);
console.log("\nAdd to .env.local:");
console.log(`STRIPE_PRICE_PREMIUM=${premiumPrice.id}`);
console.log(`STRIPE_PRICE_LIFETIME=${lifetimePrice.id}`);
