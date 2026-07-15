"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getTestById, FREE_TEST_ID } from "@/lib/tests";
import { getUserAccess } from "@/lib/supabase-users";
import { sameIndexSet } from "@/lib/utils";

export interface TestProgressRow {
  answers: Record<number, number[]>;
  score: number | null;
  completedAt: string | null;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}

/**
 * Every read/write for a specific test goes through here, not just
 * requireUserId - this is what actually stops a signed-in-but-unpaid user
 * from reading or writing progress for a paid test by calling the Server
 * Action directly, bypassing the page-level redirect.
 */
async function requireTestAccess(testId: number): Promise<string> {
  const userId = await requireUserId();
  if (testId !== FREE_TEST_ID) {
    const { hasAccess } = await getUserAccess(userId);
    if (!hasAccess) {
      throw new Error("Premium or Lifetime Access required for this test");
    }
  }
  return userId;
}

export async function getProgressForTest(testId: number): Promise<TestProgressRow | null> {
  const userId = await requireTestAccess(testId);
  const { data, error } = await supabaseAdmin
    .from("mock_test_progress")
    .select("answers, score, completed_at")
    .eq("user_id", userId)
    .eq("test_id", testId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return { answers: data.answers ?? {}, score: data.score, completedAt: data.completed_at };
}

export async function getAllProgress(): Promise<Record<number, TestProgressRow>> {
  const userId = await requireUserId();
  const { data, error } = await supabaseAdmin
    .from("mock_test_progress")
    .select("test_id, answers, score, completed_at")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  const result: Record<number, TestProgressRow> = {};
  for (const row of data ?? []) {
    result[row.test_id] = { answers: row.answers ?? {}, score: row.score, completedAt: row.completed_at };
  }
  return result;
}

/**
 * Records a single answer and, server-side only, computes whether the test
 * is now complete and what the score is. The client never sends a score or
 * a correctness flag - only which option(s) were picked.
 */
export async function submitAnswer(
  testId: number,
  questionIndex: number,
  selectedOptions: number[]
) {
  const userId = await requireTestAccess(testId);
  const test = getTestById(testId);
  if (!test) throw new Error("Invalid test id");
  if (questionIndex < 0 || questionIndex >= test.questions.length) {
    throw new Error("Invalid question index");
  }
  const question = test.questions[questionIndex];
  const uniqueOptions = new Set(selectedOptions);
  if (
    uniqueOptions.size !== selectedOptions.length ||
    uniqueOptions.size !== question.correctIndexes.length ||
    selectedOptions.some((opt) => opt < 0 || opt >= question.options.length)
  ) {
    throw new Error("Invalid option selection");
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("mock_test_progress")
    .select("answers")
    .eq("user_id", userId)
    .eq("test_id", testId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  const answers: Record<number, number[]> = {
    ...(existing?.answers ?? {}),
    [questionIndex]: selectedOptions,
  };

  let score: number | null = null;
  let completedAt: string | null = null;
  if (Object.keys(answers).length === test.questions.length) {
    score = test.questions.reduce(
      (acc, q, i) => acc + (sameIndexSet(answers[i], q.correctIndexes) ? 1 : 0),
      0
    );
    completedAt = new Date().toISOString();
  }

  const { error: upsertError } = await supabaseAdmin.from("mock_test_progress").upsert(
    {
      user_id: userId,
      test_id: testId,
      answers,
      score,
      completed_at: completedAt,
      total_questions: test.questions.length,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,test_id" }
  );

  if (upsertError) throw new Error(upsertError.message);

  return { answers, score, completedAt } satisfies TestProgressRow;
}

export async function resetTestProgress(testId: number) {
  const userId = await requireTestAccess(testId);
  const { error } = await supabaseAdmin
    .from("mock_test_progress")
    .delete()
    .eq("user_id", userId)
    .eq("test_id", testId);

  if (error) throw new Error(error.message);
}
