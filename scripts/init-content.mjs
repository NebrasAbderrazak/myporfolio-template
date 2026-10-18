import { cpSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const target = path.join(ROOT, "content");

if (existsSync(target)) {
  console.error("content/ already exists. Edit it directly, or delete it first to start over from the starter content.");
  process.exit(1);
}

cpSync(path.join(ROOT, "starter", "content"), target, { recursive: true });
console.log(`
Created content/ from the starter content.

Next:
  1. Edit content/settings/site.json and content/settings/profile.json (or use the admin panel).
  2. Replace the example projects in content/projects/ with your own.
  3. Commit content/ so the admin panel can edit it.
`);
