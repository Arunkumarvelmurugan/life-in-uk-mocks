"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export interface UpdateNameState {
  status: "idle" | "success" | "error";
  message?: string;
}

const MAX_NAME_LENGTH = 80;

export async function updateDisplayName(
  _prevState: UpdateNameState,
  formData: FormData
): Promise<UpdateNameState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "You must be signed in." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { status: "error", message: "Name can't be empty." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { status: "error", message: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ display_name: name, updated_at: new Date().toISOString() })
    .eq("id", session.user.id);

  if (error) {
    return { status: "error", message: "Couldn't save your name — please try again." };
  }

  revalidatePath("/account");
  revalidatePath("/", "layout");

  return { status: "success" };
}
