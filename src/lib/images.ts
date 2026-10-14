import fs from "node:fs";
import path from "node:path";

const MANIFEST = path.join(process.cwd(), "src", "generated", "image-manifest.json");

export type ImageMeta = { width: number; height: number };

let cache: Record<string, ImageMeta> | null = null;

export function getImageMeta(src: string): ImageMeta | undefined {
  if (!cache || process.env.NODE_ENV === "development") {
    try {
      cache = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
    } catch {
      cache = {};
    }
  }
  return cache![src];
}
