import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createPrompt, slugify, today, yaml } from "./lib/prompt.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const prompt = createPrompt();

console.log("\nNew project. Press Enter to accept the value in [brackets].\n");

const title = await prompt.askRequired("Project title");
const summary = await prompt.askRequired("One-sentence summary");
const mission = await prompt.ask("Mission: what it is for and who it helps (Enter to skip)");
const tags = (await prompt.ask("Tags, comma separated", "PHP, MySQL"))
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
const role = await prompt.ask("Your role", "Design, development, deployment");
const link = await prompt.ask("Live link (Enter to skip)");
let mockup = (await prompt.ask("Show the screenshot in a laptop, phone, browser or none?", "laptop")).toLowerCase();
if (!["laptop", "phone", "browser", "none"].includes(mockup)) mockup = "laptop";
const featured = /^y/i.test(await prompt.ask("Show on the home page? (y/n)", "y"));
const date = await prompt.askDate("Date (YYYY-MM-DD)", today());
const slug = slugify(await prompt.ask("URL name", slugify(title)));
prompt.close();

if (!slug) {
  console.error("\nThe URL name can't be empty.");
  process.exit(1);
}

const file = path.join(ROOT, "content", "projects", `${slug}.mdx`);
if (existsSync(file)) {
  console.error(`\ncontent/projects/${slug}.mdx already exists. Pick another URL name.`);
  process.exit(1);
}

const imageDir = path.join(ROOT, "public", "projects", slug);
mkdirSync(imageDir, { recursive: true });
mkdirSync(path.dirname(file), { recursive: true });

writeFileSync(
  file,
  `---
title: ${yaml(title)}
summary: ${yaml(summary)}
date: ${yaml(date)}
tags: ${yaml(tags)}
cover: ${yaml(`/projects/${slug}/cover.jpg`)}
coverAlt: ${yaml(`${title}, screenshot`)}
mockup: ${yaml(mockup)}
mission: ${yaml(mission)}
link: ${yaml(link)}
role: ${yaml(role)}
featured: ${featured}
---

## The context

Who was this for, and what problem did they have?

## What I built

- The main features, in plain words
- One technical decision you are proud of

## How it runs

Where it is hosted and how it is deployed.

## What I learned

One honest takeaway.
`,
);

console.log(`
Created content/projects/${slug}.mdx

Next:
  1. Put a screenshot at public/projects/${slug}/cover.jpg
     ${mockup === "phone" ? "(a phone screenshot, portrait, about 1170x2532)" : "(a desktop screenshot, 16:10, e.g. 1920x1200)"}
     .png or .webp also work, then update "cover". Optional: a square logo at
     public/projects/${slug}/icon.png, then add  icon: "/projects/${slug}/icon.png".
  2. Write the case study in content/projects/${slug}.mdx.
     Extra screenshots go in the same image folder:
     ![What the screenshot shows](/projects/${slug}/screen-1.jpg "Optional caption")
  3. Preview: npm run dev, then open http://localhost:3000/work/${slug}/
`);
