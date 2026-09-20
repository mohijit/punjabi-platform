/**
 * Module resolution hooks so plain Node can run the project's TypeScript the
 * same way Next does: the "@/" path alias, and extensionless imports.
 */

import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = pathToFileURL(process.cwd() + "/").href;

export async function resolve(specifier, context, next) {
  const spec = specifier.startsWith("@/")
    ? new URL(specifier.slice(2), root).href
    : specifier;

  try {
    return await next(spec, context);
  } catch (error) {
    const parent = context.parentURL ?? root;
    for (const suffix of [".ts", "/index.ts", ".tsx"]) {
      const url = new URL(spec + suffix, parent);
      if (url.protocol === "file:" && existsSync(fileURLToPath(url))) {
        return { url: url.href, shortCircuit: true };
      }
    }
    throw error;
  }
}
