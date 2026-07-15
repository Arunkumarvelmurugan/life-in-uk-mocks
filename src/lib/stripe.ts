import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export type Plan = "free" | "premium" | "lifetime";

export const STRIPE_PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM!;
export const STRIPE_PRICE_LIFETIME = process.env.STRIPE_PRICE_LIFETIME!;
