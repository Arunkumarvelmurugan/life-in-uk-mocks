"use client";

import { useState, useActionState } from "react";
import { Send, CheckCircle2, AlertCircle, User, Mail, Tag, MessageSquare } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/lib/contact-actions";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "guarantee", label: "Pass Guarantee / refund claim" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical issue" },
  { value: "other", label: "Other" },
];

const initialState: ContactFormState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-card-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary";

export function ContactForm({
  defaultName,
  defaultEmail,
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  // Remounting via key gives a fresh useActionState instance, so "Send
  // another message" actually resets the form instead of being stuck on
  // the success screen (which persists otherwise - clicking "Contact" in
  // the header while already on /contact doesn't remount the page).
  const [formKey, setFormKey] = useState(0);

  return (
    <ContactFormInner
      key={formKey}
      defaultName={defaultName}
      defaultEmail={defaultEmail}
      onSendAnother={() => setFormKey((k) => k + 1)}
    />
  );
}

function ContactFormInner({
  defaultName,
  defaultEmail,
  onSendAnother,
}: {
  defaultName?: string;
  defaultEmail?: string;
  onSendAnother: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 size={32} className="text-success" />
        <p className="text-lg font-semibold text-success">Message sent</p>
        <p className="text-sm text-muted-foreground">
          Thanks for reaching out - we&apos;ll get back to you as soon as we can.
        </p>
        <button
          onClick={onSendAnother}
          className="mt-2 cursor-pointer text-sm font-medium text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-border bg-danger-bg px-4 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <span className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input name="name" defaultValue={defaultName} required className={inputClasses} />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <span className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              name="email"
              type="email"
              defaultValue={defaultEmail}
              required
              className={inputClasses}
            />
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Topic
        <span className="relative">
          <Tag size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select name="topic" defaultValue="general" className={inputClasses}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <span className="relative">
          <MessageSquare size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground" />
          <textarea
            name="message"
            rows={6}
            required
            placeholder="How can we help?"
            className={inputClasses}
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Send size={16} />
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
