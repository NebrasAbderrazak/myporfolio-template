import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

export function createPrompt() {
  const rl = createInterface({ input: stdin, output: stdout, terminal: Boolean(stdin.isTTY) });
  const lines = rl[Symbol.asyncIterator]();
  let ended = false;

  async function ask(question, fallback = "") {
    const hint = fallback ? ` [${fallback}]` : "";
    stdout.write(`${question}${hint}: `);
    const { value, done } = await lines.next();
    if (done) ended = true;
    if (!stdin.isTTY) stdout.write(`${value ?? ""}\n`);
    return (value ?? "").trim() || fallback;
  }

  async function askRequired(question) {
    for (;;) {
      const answer = await ask(question);
      if (answer) return answer;
      if (ended) {
        console.error("\nNo answer given. Nothing was created.");
        process.exit(1);
      }
      console.log("  This one is required.");
    }
  }

  async function askDate(question, fallback) {
    for (;;) {
      const answer = await ask(question, fallback);
      if (/^\d{4}-\d{2}-\d{2}$/.test(answer) && !Number.isNaN(Date.parse(answer))) return answer;
      if (ended) process.exit(1);
      console.log("  Use the format YYYY-MM-DD, for example 2026-10-14.");
    }
  }

  return { ask, askRequired, askDate, close: () => rl.close() };
}

export function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const yaml = (value) => JSON.stringify(value);
