import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type Project = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  year: string;
  tags: string[];
  cover?: string;
  coverAlt: string;
  mockup: "laptop" | "phone" | "browser" | "none";
  icon?: string;
  mission?: string;
  link?: string;
  role?: string;
  featured: boolean;
  placeholder: boolean;
  body: string;
};

const MOCKUPS = ["laptop", "phone", "browser", "none"] as const;

export type Update = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  link?: string;
  body: string;
};

type Raw = Record<string, unknown>;

function toDate(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  throw new Error(`${file}: "date" must look like 2026-10-14`);
}

function required(data: Raw, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: frontmatter field "${key}" is missing or empty`);
  }
  return value.trim();
}

function optional(data: Raw, key: string): string | undefined {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function list(data: Raw, key: string): string[] {
  const value = data[key];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function readDir(dir: string) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((name) => /\.mdx?$/.test(name) && !name.startsWith("_"))
    .map((name) => {
      const file = path.join(dir, name);
      const { data, content } = matter(fs.readFileSync(path.join(full, name), "utf8"));
      return { file, slug: name.replace(/\.mdx?$/, ""), data: data as Raw, body: content };
    });
}

function existingPublicFile(src: string | undefined, file: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  if (fs.existsSync(path.join(PUBLIC_DIR, normalized))) return normalized;
  console.warn(`[content] ${file}: "${src}" not found in /public. Showing a placeholder instead.`);
  return undefined;
}

const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

export function getProjects(): Project[] {
  return readDir("projects")
    .map(({ file, slug, data, body }) => {
      const date = toDate(data.date, file);
      const title = required(data, "title", file);
      const mockup = optional(data, "mockup") ?? "laptop";
      if (!MOCKUPS.includes(mockup as Project["mockup"])) {
        throw new Error(`${file}: "mockup" must be one of ${MOCKUPS.join(", ")}`);
      }
      return {
        slug,
        title,
        summary: required(data, "summary", file),
        date,
        year: date.slice(0, 4),
        tags: list(data, "tags"),
        cover: existingPublicFile(optional(data, "cover"), file),
        coverAlt: optional(data, "coverAlt") ?? `${title}, screenshot`,
        mockup: mockup as Project["mockup"],
        icon: existingPublicFile(optional(data, "icon"), file),
        mission: optional(data, "mission"),
        link: optional(data, "link"),
        role: optional(data, "role"),
        featured: data.featured === true,
        placeholder: data.placeholder === true,
        body,
      };
    })
    .sort(byDateDesc);
}

export function getFeaturedProjects(limit = 6): Project[] {
  const all = getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getMoreProjects(slug: string, count = 2): Project[] {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  const others: Project[] = [];
  for (let k = 1; k < all.length && others.length < count; k++) others.push(all[(i + k) % all.length]);
  return others;
}

export function getUpdates(limit?: number): Update[] {
  const updates = readDir("updates")
    .map(({ file, slug, data, body }) => ({
      slug,
      title: required(data, "title", file),
      date: toDate(data.date, file),
      tags: list(data, "tags"),
      link: optional(data, "link"),
      body,
    }))
    .sort(byDateDesc);
  return limit ? updates.slice(0, limit) : updates;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string, style: "long" | "short" = "long") {
  const [y, m, d] = iso.split("-").map(Number);
  if (style === "short") return `${d} ${MONTHS[m - 1]} ${y}`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
