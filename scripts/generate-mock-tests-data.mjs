// Regenerates src/lib/mock-tests-data.ts from mocks-source/*.txt.
//
// For each test N, uses "Mock TestN_Updated.txt" if present, otherwise
// falls back to "Mock TestN.txt". Drop an updated file in mocks-source/ and
// re-run this script (`node scripts/generate-mock-tests-data.mjs`) to pick
// up new content - e.g. Memory Tip sections - for that test only.
import { readFileSync, writeFileSync, existsSync } from "fs";

const dir = "mocks-source";
const TOTAL_TESTS = 17;

function sourceFileFor(testId) {
  const updated = `${dir}/Mock Test${testId}_Updated.txt`;
  const original = `${dir}/Mock Test${testId}.txt`;
  return existsSync(updated) ? updated : original;
}

// Optional per-test recap shown below the results panel. Not every test has
// one yet - drop a "Mock TestN_What You Learned.txt" file in mocks-source/
// and re-run this script to pick it up for that test only.
function whatYouLearnedFileFor(testId) {
  const file = `${dir}/Mock Test${testId}_What You Learned.txt`;
  return existsSync(file) ? file : null;
}

function parseWhatYouLearned(file) {
  const raw = readFileSync(file, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("*") && l.includes("→")) // only the "* emoji **Term** -> fact" lines
    .map((l) => l.replace(/^\*\s+/, "")); // strip the markdown bullet marker, keep **bold**/*italic* spans
}

function collapseBlankRuns(lines) {
  const out = [];
  for (const l of lines) {
    if (l === "" && out[out.length - 1] === "") continue;
    out.push(l);
  }
  while (out[0] === "") out.shift();
  while (out[out.length - 1] === "") out.pop();
  return out;
}

// Source text uses the same generic "waving black flag" glyph for both
// England and Scotland, so they're visually indistinguishable in the UI.
// Swap in the actual England/Scotland flag tag-sequences.
function fixNationFlags(line) {
  return line
    .replace(/🏴(?=\s*England)/g, "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}")
    .replace(/🏴(?=\s*Scotland)/g, "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}");
}

function parseFile(file) {
  const raw = readFileSync(file, "utf-8");
  const lines = raw.split(/\r?\n/);

  const qStarts = [];
  lines.forEach((line, i) => {
    const m = line.match(/^Q(\d+)\.\s*(.*)$/);
    if (m) qStarts.push({ i, num: Number(m[1]), text: m[2] });
  });

  const questions = [];
  for (let qi = 0; qi < qStarts.length; qi++) {
    const start = qStarts[qi];
    const end = qi + 1 < qStarts.length ? qStarts[qi + 1].i : lines.length;
    const body = lines.slice(start.i + 1, end);

    let questionText = start.text.trim();
    let bodyLines = body;
    if (!questionText) {
      const idx = bodyLines.findIndex((l) => l.trim() !== "");
      if (idx !== -1) {
        questionText = bodyLines[idx].trim();
        bodyLines = bodyLines.slice(idx + 1);
      }
    }

    const explIdx = bodyLines.findIndex((l) => /^Explanation:/.test(l.trim()));
    const optionLines = (explIdx === -1 ? bodyLines : bodyLines.slice(0, explIdx))
      .map((l) => l.trim())
      .filter((l) => l !== "");

    const memoryTipIdx =
      explIdx === -1
        ? -1
        : bodyLines.findIndex((l, i) => i > explIdx && /🧠/.test(l));

    let explanation = "";
    if (explIdx !== -1) {
      const explEnd = memoryTipIdx === -1 ? bodyLines.length : memoryTipIdx;
      const firstLine = bodyLines[explIdx].trim().replace(/^Explanation:\s*/, "");
      const rest = bodyLines
        .slice(explIdx + 1, explEnd)
        .map((l) => l.trim())
        .filter((l) => l !== "");
      explanation = [firstLine, ...rest].join(" ").trim();
    }

    let memoryTip = "";
    let quickMemoryRule = "";
    if (memoryTipIdx !== -1) {
      const tipLines = bodyLines.slice(memoryTipIdx + 1).map((l) => fixNationFlags(l.trim()));
      const ruleIdx = tipLines.findIndex((l) => /^Quick Memory Rule$/i.test(l));
      const mainLines = ruleIdx === -1 ? tipLines : tipLines.slice(0, ruleIdx);
      memoryTip = collapseBlankRuns(mainLines).join("\n");
      if (ruleIdx !== -1) {
        // Quick Memory Rule is meant to be a tight, scannable list - drop the
        // blank lines between entries instead of preserving them as
        // paragraph breaks (unlike memoryTip, which keeps them). A blank
        // line is kept only where the format switches from an arrow-style
        // list entry to a closing prose sentence (or vice versa).
        const ruleLines = tipLines.slice(ruleIdx + 1).filter((l) => l !== "");
        const out = [];
        ruleLines.forEach((line, i) => {
          if (i > 0 && /→/.test(ruleLines[i - 1]) !== /→/.test(line)) out.push("");
          out.push(line);
        });
        quickMemoryRule = out.join("\n");
      }
    }

    const options = [];
    const correctIndexes = [];
    optionLines.forEach((line, idx) => {
      const isCorrect = line.includes("✅") || line.includes("✓");
      const text = line.replace(/✅/g, "").replace(/❌/g, "").replace(/✓/g, "").trim();
      options.push(text);
      if (isCorrect) correctIndexes.push(idx);
    });

    questions.push({
      question: questionText,
      options,
      correctIndexes,
      explanation,
      memoryTip,
      quickMemoryRule,
    });
  }

  if (questions.length !== 24) {
    console.log(`WARNING ${file}: ${questions.length} questions found (expected 24)`);
  }
  return questions;
}

const allTests = [];
for (let testId = 1; testId <= TOTAL_TESTS; testId++) {
  const file = sourceFileFor(testId);
  const questions = parseFile(file);
  const wylFile = whatYouLearnedFileFor(testId);
  const whatYouLearned = wylFile ? parseWhatYouLearned(wylFile) : [];
  allTests.push({ id: testId, file, questions, whatYouLearned });
}

console.log(
  `Parsed ${allTests.length} tests, ${allTests.reduce((a, t) => a + t.questions.length, 0)} total questions`
);
allTests.forEach((t) => {
  const withTip = t.questions.filter((q) => q.memoryTip).length;
  if (withTip > 0) console.log(`  Test ${t.id} (${t.file}): ${withTip}/24 questions have a Memory Tip`);
  if (t.whatYouLearned.length > 0)
    console.log(`  Test ${t.id}: ${t.whatYouLearned.length} What You Learned facts`);
});

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/—/g, "-");
}

function emitTest(t) {
  const qs = t.questions
    .map((q) => {
      const opts = q.options.map((o) => `"${esc(o)}"`).join(", ");
      const tipPart = q.memoryTip ? `, memoryTip: "${esc(q.memoryTip)}"` : "";
      const rulePart = q.quickMemoryRule ? `, quickMemoryRule: "${esc(q.quickMemoryRule)}"` : "";
      return `    { question: "${esc(q.question)}", options: [${opts}], correctIndexes: [${q.correctIndexes.join(", ")}], explanation: "${esc(q.explanation)}"${tipPart}${rulePart} }`;
    })
    .join(",\n");
  const wylPart = t.whatYouLearned.length
    ? `,\n    whatYouLearned: [${t.whatYouLearned.map((f) => `"${esc(f)}"`).join(", ")}]`
    : "";
  return `  {\n    id: ${t.id},\n    title: "Life in the UK Test ${t.id}",\n    questions: [\n${qs},\n    ]${wylPart},\n  }`;
}

const header = `// Generated from mocks-source/*.txt by scripts/generate-mock-tests-data.mjs.
// Do not hand-edit - re-run the script against the source .txt files instead.
import type { MockTest } from "./tests";

export const mockTestsData: MockTest[] = [\n${allTests.map(emitTest).join(",\n")},\n];\n`;

writeFileSync("src/lib/mock-tests-data.ts", header, "utf-8");
console.log("\nWrote src/lib/mock-tests-data.ts");
