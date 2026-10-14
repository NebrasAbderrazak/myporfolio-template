// Windows-only Next.js export bug: nested prefetch files (out/x/__next.a/b.txt)
// must be flat (out/x/__next.a.b.txt) for client-side navigation. No-op elsewhere.
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");

async function filesUnder(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await filesUnder(full)));
    else result.push(full);
  }
  return result;
}

async function flatten(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const rel = path.relative(full, file).split(path.sep).join(".");
        await rename(file, path.join(dir, `${entry.name}.${rel}`));
        moved++;
      }
      await rm(full, { recursive: true, force: true });
    } else {
      moved += await flatten(full);
    }
  }
  return moved;
}

try {
  await stat(OUT);
} catch {
  console.error("postbuild: no /out folder found");
  process.exit(1);
}

const moved = await flatten(OUT);
console.log(`postbuild: ${moved ? `flattened ${moved} prefetch file(s)` : "nothing to fix"}`);
