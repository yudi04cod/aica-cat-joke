// The One-Line Cat Joke That Lands — entry program (program/v1, node22).
// Writes exactly one original one-line cat joke to /output/entry.txt.
// The joke must be 1-200 characters, a single line, UTF-8, not only
// whitespace — the gate rejects anything else, so we validate before
// writing and fail loudly instead of shipping a bad artifact.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The joke: a setup (the cat learned to open doors) with a turn that
// lands (the human now knocks before entering their own bedroom).
// Role reversal, no pun, short enough to retell to a friend.
const JOKE =
  "My cat learned to open doors, so now I knock before entering my own bedroom.";

// The grader runs this with /output as the working output directory;
// fall back to a local ./output when /output is not writable.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function main(): void {
  const line = JOKE.trim();
  if (line.length < 1 || line.length > 200) {
    throw new Error(`joke must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("joke must be a single line");
  }
  if (!line.toLowerCase().includes("cat")) {
    throw new Error("joke must be about cats");
  }
  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, "entry.txt");
  writeFileSync(outPath, line + "\n", "utf8");
  // Read back and verify: the file on disk must be exactly the joke
  // plus one trailing newline, so a silent write failure can never
  // ship a truncated or empty artifact to the gate.
  const written = readFileSync(outPath, "utf8");
  if (written !== line + "\n") {
    throw new Error("verification failed: entry.txt does not match the joke");
  }
  console.log(`wrote ${line.length} characters to ${outPath}`);
}

main();
