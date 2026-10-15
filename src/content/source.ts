import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const DOCUMENT = /\.mdx?$/;

export class ContentError extends Error {
  constructor(file: string, detail: string) {
    super(`Invalid content in content/${file}\n${detail}`);
    this.name = "ContentError";
  }
}

function validate<S extends z.ZodType>(schema: S, data: unknown, file: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new ContentError(file, z.prettifyError(result.error));
  return result.data;
}

export function readDocument<S extends z.ZodType>(file: string, schema: S): z.output<S> {
  const raw = fs.readFileSync(path.join(CONTENT_ROOT, file), "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new ContentError(file, `Not valid JSON: ${(error as Error).message}`);
  }
  return validate(schema, data, file);
}

export type Entry<T> = T & {
  slug: string;
  file: string;
  body: string;
  format: "md" | "mdx";
};

export function readCollection<S extends z.ZodType<object>>(dir: string, schema: S): Entry<z.output<S>>[] {
  const folder = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(folder)) return [];

  return fs
    .readdirSync(folder)
    .filter((name) => DOCUMENT.test(name) && !name.startsWith("_"))
    .map((name) => {
      const file = `${dir}/${name}`;
      const { data, content } = matter(fs.readFileSync(path.join(folder, name), "utf8"));
      return {
        ...validate(schema, data, file),
        slug: name.replace(DOCUMENT, ""),
        file,
        body: content.trim(),
        format: name.endsWith(".mdx") ? "mdx" : "md",
      };
    });
}

const reported = new Set<string>();

export function warnOnce(message: string) {
  if (reported.has(message)) return;
  reported.add(message);
  console.warn(`[content] ${message}`);
}

/** Keeps remote URLs as they are and drops local paths that point at a missing file. */
export function resolveAsset(src: string | undefined, file: string): string | undefined {
  if (!src || /^https?:\/\//.test(src)) return src;
  if (fs.existsSync(path.join(PUBLIC_ROOT, src))) return src;
  warnOnce(`content/${file}: "${src}" was not found in /public and will be skipped.`);
  return undefined;
}

export function requireAsset(src: string, file: string): string {
  const resolved = resolveAsset(src, file);
  if (!resolved) throw new ContentError(file, `"${src}" was not found in /public.`);
  return resolved;
}
