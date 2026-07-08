import { questionPool, type PoolQuestion } from "./question-pool";

export interface TestQuestion extends PoolQuestion {
  options: string[];
  correctIndex: number;
}

export interface MockTest {
  id: number;
  title: string;
  questions: TestQuestion[];
}

export const TOTAL_TESTS = 17;
export const QUESTIONS_PER_TEST = 24;

/** The one test signed-out visitors can take without an account. */
export const FREE_TEST_ID = 1;

/** Deterministic seeded PRNG so each test is stable across reloads. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Question pool is currently a starter set. Each test draws
 * QUESTIONS_PER_TEST questions from a seeded shuffle of the pool, cycling
 * through if the pool is smaller than needed. Grow question-pool.ts to
 * remove cross-test repeats.
 */
function buildTest(testId: number): MockTest {
  const shuffled = seededShuffle(questionPool, testId * 7919 + 13);
  const questions: TestQuestion[] = [];
  for (let i = 0; i < QUESTIONS_PER_TEST; i++) {
    const base = shuffled[i % shuffled.length];
    const optionOrder = seededShuffle(
      base.options.map((opt, idx) => ({ opt, idx })),
      testId * 104729 + i * 31
    );
    questions.push({
      ...base,
      id: `${base.id}-t${testId}-q${i}`,
      options: optionOrder.map((o) => o.opt),
      correctIndex: optionOrder.findIndex((o) => o.idx === base.correctIndex),
    });
  }
  return {
    id: testId,
    title: `Life in the UK Test ${testId}`,
    questions,
  };
}

export const mockTests: MockTest[] = Array.from({ length: TOTAL_TESTS }, (_, i) =>
  buildTest(i + 1)
);

export function getTestById(id: number): MockTest | undefined {
  return mockTests.find((t) => t.id === id);
}
