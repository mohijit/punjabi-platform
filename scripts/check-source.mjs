/**
 * Source hygiene. Run with: npm run check
 *
 * Catches stray characters that are invisible in review but corrupt meaning —
 * CJK ideographs and full-width punctuation drifting into English prose, and
 * bidi or zero-width controls. Gurmukhi, IPA, accented Latin and the box-drawing
 * characters used in comments are all expected and allowed.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["app", "components", "content", "lib", "scripts"];
const EXTENSIONS = [".ts", ".tsx", ".mjs", ".css", ".md"];

/** CJK, full-width forms, and invisible formatting controls. */
// Built from escapes rather than written as a literal, so this file does not
// trip its own check.
const FORBIDDEN = new RegExp(
  "[" +
    "\\u3000-\\u303F\\u3040-\\u30FF" + // CJK punctuation, kana
    "\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uF900-\\uFAFF" + // ideographs
    "\\uFF00-\\uFFEF" + // full-width forms
    "\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064" + // zero-width, bidi
    "]",
  "u",
);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.some((extension) => entry.endsWith(extension))) yield path;
  }
}

const problems = [];
let scanned = 0;

for (const root of ROOTS) {
  let entries;
  try {
    entries = [...walk(root)];
  } catch {
    continue; // A directory that does not exist yet is not an error.
  }
  for (const path of entries) {
    scanned += 1;
    const lines = readFileSync(path, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      const match = FORBIDDEN.exec(line);
      if (match) {
        const code = match[0].codePointAt(0).toString(16).padStart(4, "0");
        problems.push(
          `${relative(".", path)}:${index + 1}  stray U+${code.toUpperCase()} in: ${line.trim().slice(0, 70)}`,
        );
      }
    });
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} stray character(s):`);
  for (const message of problems) console.error("  ✗ " + message);
  process.exit(1);
}

console.log(`source           ${scanned} files, no stray characters.`);
