import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { signInWithGoogle } from "@/lib/auth-actions";
import { getUserDisplayName, getUserAccess } from "@/lib/supabase-users";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export async function SiteHeader() {
  const session = await auth();
  const displayName = session?.user ? await getUserDisplayName(session.user.id) : null;
  const hasFullAccess = session?.user ? (await getUserAccess(session.user.id)).hasAccess : false;

  return (
    <header className="sticky top-0 z-20 border-b border-card-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap text-lg font-extrabold tracking-tight"
        >
          <Image
            src="/LifeinUKMocks.jpg"
            alt=""
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="hidden sm:inline">
            Life in UK<span className="text-primary"> Mocks</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/practice/mock-tests" className="text-muted-foreground hover:text-foreground">
            Mock Tests
          </Link>
          <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
            {hasFullAccess ? "Membership" : "Pricing"}
          </Link>
          <Link href="/#guarantee" className="text-muted-foreground hover:text-foreground">
            Pass Guarantee
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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.998 11.998 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
