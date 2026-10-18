// Copies the code and the starter content from this repository into a checkout of
// the public template, leaving out content/ and personal media, then checks that
// no personal details slipped through. It stages the result; you review and commit.
//
//   npm run publish:template -- ../portfolio-template

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const target = path.resolve(process.argv[2] ?? path.join(ROOT, "..", "portfolio-template"));

const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8" });

function fail(message) {
  console.error(`\npublish:template: ${message}`);
  process.exit(1);
}

const isPersonal = (file) => file.startsWith("content/") || (file.startsWith("public/media/") && !file.startsWith("public/media/starter/"));

if (git(ROOT, "status", "--porcelain").trim()) fail("commit or stash your changes first, so the template matches a real commit.");
if (!existsSync(path.join(target, ".git"))) fail(`${target} is not a git checkout. Clone the public template there first.`);
if (path.resolve(target) === ROOT) fail("the target is this repository.");

// Private details to look for in the exported text.
const markers = new Set();
const profilePath = path.join(ROOT, "content", "settings", "profile.json");
if (existsSync(profilePath)) {
  const profile = JSON.parse(readFileSync(profilePath, "utf8"));
  if (profile.email && !/example\.(com|org|net)$/.test(profile.email)) markers.add(profile.email);
  if (profile.whatsapp) markers.add(profile.whatsapp.replace(/\D/g, ""));
  for (const social of profile.socials ?? []) markers.add(social.url);
}
const projectsDir = path.join(ROOT, "content", "projects");
if (existsSync(projectsDir)) {
  for (const name of readdirSync(projectsDir)) markers.add(`/media/projects/${name.replace(/\.mdx?$/, "")}/`);
}

const files = git(ROOT, "ls-files", "-z").split("\0").filter(Boolean);
const exported = files.filter((file) => !isPersonal(file));

for (const entry of readdirSync(target)) {
  if (entry !== ".git") rmSync(path.join(target, entry), { recursive: true, force: true });
}
for (const file of exported) {
  const from = path.join(ROOT, file);
  if (!existsSync(from) || !statSync(from).isFile()) continue;
  mkdirSync(path.dirname(path.join(target, file)), { recursive: true });
  cpSync(from, path.join(target, file));
}

const TEXT = /\.(md|mdx|json|ya?ml|ts|tsx|mjs|mts|js|css|conf|txt|html)$/i;
const leaks = [];
for (const file of exported) {
  if (!TEXT.test(file) || file === "package-lock.json") continue;
  const text = readFileSync(path.join(target, file), "utf8");
  const digits = text.replace(/\D/g, "");
  for (const marker of markers) {
    if (/^\d+$/.test(marker) ? digits.includes(marker) : text.includes(marker)) leaks.push(`${file}: contains ${marker}`);
  }
}
if (existsSync(path.join(target, "content"))) leaks.push("content/ exists in the export");
if (leaks.length) fail(`personal details found, nothing was staged:\n  ${leaks.join("\n  ")}`);

git(target, "add", "-A");
console.log(`publish:template: copied ${exported.length} files, left out ${files.length - exported.length} personal files.`);
console.log(git(target, "status", "--short") || "No changes.");
console.log(`Review the staged changes in ${target}, then commit and push from there.`);
