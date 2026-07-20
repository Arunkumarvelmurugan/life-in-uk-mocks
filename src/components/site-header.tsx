import Link from "next/link";
import { auth } from "@/auth";
import { signInWithGoogle } from "@/lib/auth-actions";
import { getUserDisplayName, getUserAccess } from "@/lib/supabase-users";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { GoogleIcon } from "@/components/google-icon";

export async function SiteHeader() {
  const session = await auth();
  const displayName = session?.user ? await getUserDisplayName(session.user.id) : null;
  const hasFullAccess = session?.user ? (await getUserAccess(session.user.id)).hasAccess : false;

  return (
    <header className="sticky top-0 z-20 border-b border-card-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex shrink-0 items-center whitespace-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo, no
              benefit from Next's raster pipeline and this keeps it perfectly
              sharp at any zoom/pixel density */}
          <img src="/logo-header.svg" alt="Life in UK Mocks" className="h-10 w-auto dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
          <img
            src="/logo-header-dark.svg"
            alt="Life in UK Mocks"
            className="hidden h-10 w-auto dark:block"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/mock-tests" className="text-muted-foreground hover:text-foreground">
            Mock Tests
          </Link>
          <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
            {hasFullAccess ? "Membership" : "Pricing"}
          </Link>
          <Link href="/#guarantee" className="text-muted-foreground hover:text-foreground">
            Pass Guarantee
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu
              name={displayName}
              email={session.user.email}
              image={session.user.image}
            />
          ) : (
            <form action={signInWithGoogle}>
              <button
                type="submit"
                aria-label="Sign in with Google"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40"
              >
                <GoogleIcon />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
