import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { createGzip } from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..", "out");
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

// Keep in sync with deploy/nginx/security-headers.conf
const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
};

function cacheControl(urlPath) {
  if (urlPath.startsWith("/_next/static/")) return "public, max-age=31536000, immutable";
  if (/\.(webp|avif|jpe?g|png|svg|ico|woff2?)$/.test(urlPath)) return "public, max-age=604800";
  return "no-cache";
}

function resolve(urlPath) {
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) return { status: 400 };
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!urlPath.endsWith("/")) return { redirect: `${urlPath}/` };
    const index = path.join(file, "index.html");
    return existsSync(index) ? { file: index } : { status: 404 };
  }
  if (existsSync(file)) return { file };
  if (existsSync(`${file}.html`)) return { file: `${file}.html` };
  return { status: 404 };
}

if (!existsSync(ROOT)) {
  console.error("No /out folder yet. Run `npm run build` first.");
  process.exit(1);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let urlPath;
    try {
      urlPath = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const result = resolve(urlPath);
    if (result.redirect) {
      res.writeHead(301, { Location: result.redirect + url.search }).end();
      return;
    }
    let file = result.file;
    let status = 200;
    if (!file) {
      status = result.status ?? 404;
      file = path.join(ROOT, "404.html");
    }
    const type =
      (path.basename(file) === "opengraph-image" ? "image/png" : TYPES[path.extname(file).toLowerCase()]) ??
      "application/octet-stream";
    const gzip = /text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
    res.writeHead(status, {
      "Content-Type": type,
      "Cache-Control": status === 200 ? cacheControl(urlPath) : "no-cache",
      ...(gzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
      ...SECURITY,
    });
    const stream = createReadStream(file);
    if (gzip) stream.pipe(createGzip({ level: 6 })).pipe(res);
    else stream.pipe(res);
  })
  .listen(PORT, () => {
    console.log(`Previewing /out at http://localhost:${PORT}`);
  });
