"use client";

import { useActionState, useState } from "react";
import { Check, AlertCircle, Pencil } from "lucide-react";
import { updateDisplayName, type UpdateNameState } from "@/lib/account-actions";

const initialState: UpdateNameState = { status: "idle" };

export function EditNameForm({ currentName }: { currentName: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayName, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentName);
  // Drop back to view mode the moment a save succeeds - adjusted during
  // render (not an effect) per React's guidance for reacting to a prop/state
  // change without an extra render-then-effect round trip.
  const [lastStatus, setLastStatus] = useState(state.status);
  if (state.status !== lastStatus) {
    setLastStatus(state.status);
    if (state.status === "success") {
      setIsEditing(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        <p className="truncate text-lg font-semibold">{displayName}</p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40"
        >
          <Pencil size={13} />
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const input = e.currentTarget.elements.namedItem("name") as HTMLInputElement;
        setDisplayName(input.value);
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor="name" className="text-sm font-medium">
        Name
      </label>
      <div className="flex gap-2">
        <input
          id="name"
          name="name"
          defaultValue={displayName}
          maxLength={80}
          required
          autoFocus
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
      {state.status === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle size={14} />
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Check size={14} />
          Name updated.
        </p>
      )}
    </form>
  );
}
