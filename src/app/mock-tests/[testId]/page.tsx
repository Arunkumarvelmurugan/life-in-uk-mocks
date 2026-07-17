import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTestById, FREE_TEST_ID } from "@/lib/tests";
import { getProgressForTest } from "@/lib/progress-actions";
import { getUserAccess } from "@/lib/supabase-users";
import { TestTakingClient } from "./test-taking-client";

// Gated behind sign-in (src/proxy.ts) and disallowed in robots.txt - noindex
// is a page-level belt-and-braces signal in case either of those is ever
// bypassed (e.g. crawled via a referring link before the redirect fires).
// Applies even to the free test - it's still behind sign-in.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTestById(Number(testId));

  if (!test) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p>Test not found.</p>
        <Link href="/mock-tests" className="text-primary underline">
          Back to Mock Tests
        </Link>
      </div>
    );
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const isFreeTest = test.id === FREE_TEST_ID;
  if (!isFreeTest) {
    const { hasAccess } = await getUserAccess(session.user.id);
    if (!hasAccess) {
      redirect("/?upgrade=required");
    }
  }

  const progress = await getProgressForTest(test.id);

  return <TestTakingClient test={test} initialProgress={progress} />;
}
