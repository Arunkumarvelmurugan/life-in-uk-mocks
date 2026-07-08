"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";

export function UserMenu({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-card-border bg-card py-1 pl-1 pr-2.5 text-sm font-medium transition-colors hover:border-primary/40"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Google avatar, not worth next/image config for this
          <img src={image} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initial}
          </span>
        )}
        <span className="hidden max-w-[9rem] truncate sm:inline">{name ?? email}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-card-border bg-card p-1.5 shadow-xl">
            <div className="truncate px-3 py-2 text-xs text-muted-foreground">{email}</div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <User size={14} />
              My Account
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
