import { mockTestsData } from "./mock-tests-data";

export interface TestQuestion {
  question: string;
  options: string[];
  /** One index for a single-answer question, two or three for a "choose N" question. */
  correctIndexes: number[];
  explanation: string;
  /** Optional mnemonic shown alongside the explanation. Not every question has one yet. */
  memoryTip?: string;
  /** Optional short recap shown as its own card below the Memory Tip. */
  quickMemoryRule?: string;
}

export interface MockTest {
  id: number;
  title: string;
  questions: TestQuestion[];
  /** Optional recap of key facts shown below the results panel once the test is complete. */
  whatYouLearned?: string[];
}

export const TOTAL_TESTS = 17;
export const QUESTIONS_PER_TEST = 24;

/** The one test signed-out visitors can take without an account. */
export const FREE_TEST_ID = 1;

export const mockTests: MockTest[] = mockTestsData;

export function getTestById(id: number): MockTest | undefined {
  return mockTests.find((t) => t.id === id);
}
