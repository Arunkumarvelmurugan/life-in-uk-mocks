"use server";

import { headers } from "next/headers";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const TOPICS = ["general", "guarantee", "billing", "technical", "other"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 15;

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for with the real client IP first in the list.
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in your name, email, and message." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!TOPICS.includes(topic as (typeof TOPICS)[number])) {
    return { status: "error", message: "Please choose a topic." };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { status: "error", message: "Message is too long." };
  }

  const ip = await getClientIp();

  if (ip !== "unknown") {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", windowStart);

    if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
      return {
        status: "error",
        message: "You've sent a few messages already — please wait a bit before sending another.",
      };
    }
  }

  const session = await auth();

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    user_id: session?.user?.id ?? null,
    name,
    email,
    topic,
    message,
    ip_address: ip !== "unknown" ? ip : null,
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or email us directly.",
    };
  }

  return { status: "success" };
}
