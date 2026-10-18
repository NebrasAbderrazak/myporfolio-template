import { existsSync } from "node:fs";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_QUALITY, IMAGE_WIDTHS } from "../image.config.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_img");
const SKIP = new Set([OUT, path.join(PUBLIC, "static")]);
const MANIFEST = path.join(ROOT, "src", "generated", "image-manifest.json");
const RASTER = /\.(jpe?g|png|webp|avif)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP.has(full)) files.push(...(await walk(full)));
    } else if (RASTER.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function isFresh(output, sourceMtime) {
  try {
    return (await stat(output)).mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

async function main() {
  const started = Date.now();
  const sources = await walk(PUBLIC);
  const manifest = {};
  const expected = new Set();
  let written = 0;

  for (const file of sources) {
    const rel = path.relative(PUBLIC, file).split(path.sep).join("/");
    const base = rel.replace(RASTER, "");
    const { mtimeMs } = await stat(file);
    const meta = await sharp(file).rotate().metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;

    for (const w of IMAGE_WIDTHS) {
      const output = path.join(OUT, `${base}-${w}.webp`);
      expected.add(path.normalize(output));
      if (await isFresh(output, mtimeMs)) continue;
      await mkdir(path.dirname(output), { recursive: true });
      await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: IMAGE_QUALITY }).toFile(output);
      written++;
    }

    manifest[`/${rel}`] = { width, height };
  }

  let removed = 0;
  if (existsSync(OUT)) {
    for (const file of await walk(OUT)) {
      if (!expected.has(path.normalize(file))) {
        await rm(file);
        removed++;
      }
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`images: ${sources.length} source(s), ${written} file(s) written, ${removed} removed (${secs}s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
