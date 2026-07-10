"use client";

import { useActionState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { updateDisplayName, type UpdateNameState } from "@/lib/account-actions";

const initialState: UpdateNameState = { status: "idle" };

export function EditNameForm({ currentName }: { currentName: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayName, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <label htmlFor="name" className="text-sm font-medium">
        Name
      </label>
      <div className="flex gap-2">
        <input
          id="name"
          name="name"
          defaultValue={currentName}
          maxLength={80}
          required
          className="flex-1 rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
      {state.status === "success" && (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Check size={14} />
          Name updated.
        </p>
      )}
      {state.status === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle size={14} />
          {state.message}
        </p>
      )}
    </form>
  );
}
