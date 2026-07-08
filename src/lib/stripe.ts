import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const FULL_ACCESS_PRICE_GBP_PENCE = 1999;
