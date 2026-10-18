import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const ROOT = process.cwd();
const PUBLIC_ROOT = path.join(ROOT, "public");
const DOCUMENT = /\.mdx?$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const BOM = /^﻿/;

/**
 * Your own files in content/ come first. The starter content fills in anything
 * missing, so a fresh clone of the template runs without any setup.
 * PORTFOLIO_CONTENT=starter ignores content/ and shows the template as published.
 */
const SOURCES = process.env.PORTFOLIO_CONTENT === "starter" ? ["starter/content"] : ["content", "starter/content"];

function locate(relative: string) {
  for (const source of SOURCES) {
    const full = path.join(ROOT, source, relative);
    if (fs.existsSync(full)) return { full, file: `${source}/${relative}`, starter: source.startsWith("starter/") };
  }
  return null;
}

/** True when the file comes from the starter content rather than your own. */
export function isStarter(relative: string) {
  return locate(relative)?.starter ?? false;
}

class ContentError extends Error {
  constructor(file: string, detail: string) {
    super(`Invalid content in ${file}\n${detail}`);
    this.name = "ContentError";
  }
}

function validate<S extends z.ZodType>(schema: S, data: unknown, file: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new ContentError(file, z.prettifyError(result.error));
  return result.data;
}

export function readDocument<S extends z.ZodType>(relative: string, schema: S): z.output<S> {
  const found = locate(relative);
  if (!found) throw new ContentError(`content/${relative}`, "The file is missing and there is no starter version to fall back on.");
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(found.full, "utf8").replace(BOM, ""));
  } catch (error) {
    throw new ContentError(found.file, `Not valid JSON: ${(error as Error).message}`);
  }
  return validate(schema, data, found.file);
}

function splitFrontmatter(raw: string, file: string) {
  const source = raw.replace(BOM, "");
  const match = FRONTMATTER.exec(source);
  if (!match) return { data: {}, body: source };
  try {
    return { data: (parseYaml(match[1]) as unknown) ?? {}, body: source.slice(match[0].length) };
  } catch (error) {
    throw new ContentError(file, `Frontmatter is not valid YAML: ${(error as Error).message}`);
  }
}

export type Entry<T> = T & {
  slug: string;
  file: string;
  body: string;
  format: "md" | "mdx";
};

export function readCollection<S extends z.ZodType<object>>(dir: string, schema: S): Entry<z.output<S>>[] {
  const found = locate(dir);
  if (!found) return [];

  return fs
    .readdirSync(found.full)
    .filter((name) => DOCUMENT.test(name) && !name.startsWith("_"))
    .map((name) => {
      const file = `${found.file}/${name}`;
      const { data, body } = splitFrontmatter(fs.readFileSync(path.join(found.full, name), "utf8"), file);
      return {
        ...validate(schema, data, file),
        slug: name.replace(DOCUMENT, ""),
        file,
        body: body.trim(),
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
  warnOnce(`${file}: "${src}" was not found in /public and will be skipped.`);
  return undefined;
}

export function requireAsset(src: string, file: string): string {
  const resolved = resolveAsset(src, file);
  if (!resolved) throw new ContentError(file, `"${src}" was not found in /public.`);
  return resolved;
}
