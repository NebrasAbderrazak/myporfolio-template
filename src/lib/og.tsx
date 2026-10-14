import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  paper: "#f2f0eb",
  card: "#fbfaf7",
  ink: "#121411",
  soft: "#484b45",
  mute: "#8b887f",
  line: "#dedad1",
  accent: "#45712a",
  bright: "#7cb83f",
};

async function loadFonts() {
  const dir = path.join(process.cwd(), "node_modules", "@fontsource");
  const [serif, serifItalic, sans] = await Promise.all([
    readFile(path.join(dir, "instrument-serif", "files", "instrument-serif-latin-400-normal.woff")),
    readFile(path.join(dir, "instrument-serif", "files", "instrument-serif-latin-400-italic.woff")),
    readFile(path.join(dir, "schibsted-grotesk", "files", "schibsted-grotesk-latin-500-normal.woff")),
  ]);
  return [
    { name: "Serif", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Serif", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Sans", data: sans, style: "normal" as const, weight: 500 as const },
  ];
}

async function loadImage(publicPath: string) {
  const ext = path.extname(publicPath).toLowerCase();
  const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  try {
    const data = await readFile(path.join(process.cwd(), "public", publicPath));
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

const host = () => new URL(site.url).host;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `linear-gradient(112deg, ${C.paper} 0%, #ffffff 30%, ${C.paper} 45%, #fbfaf7 62%, ${C.paper} 80%)`,
        color: C.ink,
        padding: "56px 64px 52px",
        fontFamily: "Serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background: C.card,
            borderRadius: 999,
            padding: "10px 26px",
            fontSize: 38,
            fontStyle: "italic",
            boxShadow: "0 10px 30px -12px rgba(18,20,17,.25)",
            border: `1px solid ${C.line}`,
          }}
        >
          {site.shortName}
          <span style={{ color: C.bright, fontStyle: "normal" }}>.</span>
        </div>
        <div style={{ display: "flex", fontFamily: "Sans", fontSize: 20, color: C.soft, letterSpacing: 2 }}>
          {`${site.location.city.toUpperCase()}, ${site.location.country.toUpperCase()}`}
        </div>
      </div>
      {children}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Sans", fontSize: 21, color: C.soft }}>
        <div style={{ display: "flex" }}>{host()}</div>
        <div style={{ display: "flex" }}>Founder of {site.company.name}</div>
      </div>
    </div>
  );
}

export async function homeOgImage() {
  const [fonts, portrait] = await Promise.all([loadFonts(), loadImage("me.jpg")]);
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 118, lineHeight: 0.95, letterSpacing: -2 }}>
            <div style={{ display: "flex" }}>
              <span style={{ color: C.mute }}>I’m a&nbsp;</span>
              <span>Developer,</span>
            </div>
            <div style={{ display: "flex" }}>
              <span>Builder</span>
              <span style={{ color: C.mute, fontStyle: "italic" }}>&nbsp;and&nbsp;</span>
              <span style={{ color: C.accent, fontStyle: "italic" }}>Founder</span>
            </div>
          </div>
          {portrait && (
            <div style={{ display: "flex", padding: 8, borderRadius: 999, background: C.card, boxShadow: "0 30px 60px -24px rgba(18,20,17,.35)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={portrait} width={230} height={230} style={{ borderRadius: 999, objectFit: "cover" }} alt="" />
            </div>
          )}
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts },
  );
}

export async function projectOgImage(project: { title: string; year: string; tags: string[]; cover?: string }) {
  const [fonts, cover] = await Promise.all([loadFonts(), project.cover ? loadImage(project.cover) : null]);
  const titleSize = project.title.length > 34 ? 84 : 104;
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 22 }}>
            <div style={{ display: "flex", fontSize: 30, fontStyle: "italic", color: C.mute }}>Case study · {project.year}</div>
            <div style={{ display: "flex", fontSize: titleSize, lineHeight: 0.95, letterSpacing: -1.5 }}>{project.title}</div>
            <div style={{ display: "flex", gap: 10, fontFamily: "Sans", fontSize: 20 }}>
              {project.tags.slice(0, 3).map((tag) => (
                <div key={tag} style={{ display: "flex", background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 16px" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          {cover && (
            <div style={{ display: "flex", width: 360, height: 300, borderRadius: 28, overflow: "hidden", background: C.card, border: `1px solid ${C.line}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} width={360} height={300} style={{ objectFit: "cover", objectPosition: "top" }} alt="" />
            </div>
          )}
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts },
  );
}
