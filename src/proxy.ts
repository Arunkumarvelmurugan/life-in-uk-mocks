import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/mock-tests", "/account"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/", req.nextUrl.origin);
    signInUrl.searchParams.set("signin", "required");
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/mock-tests/:path*", "/account/:path*"],
};
