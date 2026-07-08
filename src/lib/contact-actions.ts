"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const TOPICS = ["general", "guarantee", "billing", "technical", "other"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

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

  const session = await auth();

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    user_id: session?.user?.id ?? null,
    name,
    email,
    topic,
    message,
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or email us directly.",
    };
  }

  return { status: "success" };
}
