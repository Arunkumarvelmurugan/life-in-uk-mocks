import { NextResponse } from "next/server";
import { TRANSACTIONAL_FROM_EMAIL } from "@/lib/resend";

export async function GET() {
  return NextResponse.json({ transactionalFromEmail: TRANSACTIONAL_FROM_EMAIL });
}
