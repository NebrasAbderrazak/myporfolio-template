import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createPrompt, slugify, today, yaml } from "./lib/prompt.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const prompt = createPrompt();

console.log("\nNew update. Keep it short: a title and two or three sentences.\n");

const title = await prompt.askRequired("Title");
const text = await prompt.ask("The post (one paragraph, Enter to write it later)");
const link = await prompt.ask("Link (Enter to skip)");
const date = await prompt.askDate("Date (YYYY-MM-DD)", today());
prompt.close();

const name = `${date}-${slugify(title) || "update"}`;
const file = path.join(ROOT, "content", "updates", `${name}.mdx`);
if (existsSync(file)) {
  console.error(`\ncontent/updates/${name}.mdx already exists.`);
  process.exit(1);
}

mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(
  file,
  `---
title: ${yaml(title)}
date: ${yaml(date)}
${link ? `link: ${yaml(link)}\n` : ""}---

${text || "Write two or three sentences about what you built, shipped or learned."}
`,
);

console.log(`
Created content/updates/${name}.mdx
${text ? "" : "Open it and write the post.\n"}Preview: npm run dev, then open http://localhost:3000/updates/
`);
