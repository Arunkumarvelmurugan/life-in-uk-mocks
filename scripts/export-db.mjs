// Manual database export for occasional backups, on top of whatever
// automatic backups your Supabase plan provides. Dumps every row from every
// application table to a single timestamped JSON file under ./backups/.
//
// Run: node --env-file=.env.local scripts/export-db.mjs
//
// The output contains real user PII (emails, names, payment history) -
// ./backups/ is gitignored. Store the file somewhere secure and delete it
// once you no longer need it.
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "node:fs/promises";

const supabase = createClient(process.env.SUPABASE_URL, process.env.AUTH_SUPABASE_SECRET, {
  auth: { persistSession: false },
});

const TABLES = ["users", "payments", "contact_messages", "mock_test_progress"];

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = new URL("../backups/", import.meta.url);
await mkdir(outDir, { recursive: true });
const outPath = new URL(`db-export-${timestamp}.json`, outDir);

const dump = {};
for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`Failed to export "${table}": ${error.message}`);
    process.exit(1);
  }
  dump[table] = data;
  console.log(`${table}: ${data.length} rows`);
}

await writeFile(outPath, JSON.stringify(dump, null, 2));
console.log(`\nSaved to ${outPath.pathname}`);
