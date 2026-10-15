import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import type { Emphasis, Tone } from "@/content/emphasis";
import type { Project } from "@/content/projects";
import { getHomePage, getProfile, getSite } from "@/content/settings";

export const OG_SIZE = { width: 1200, height: 630 };

const COLORS = {
  paper: "#f2f0eb",
  card: "#fbfaf7",
  ink: "#121411",
  soft: "#484b45",
  mute: "#8b887f",
  line: "#dedad1",
  accent: "#45712a",
  bright: "#7cb83f",
};

const TONE_COLOR: Record<Tone, string> = { ink: COLORS.ink, mute: COLORS.mute, accent: COLORS.accent };

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

const MIME: Record<string, string> = { ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

async function loadImage(publicPath: string) {
  const type = MIME[path.extname(publicPath).toLowerCase()];
  if (!type || /^https?:\/\//.test(publicPath)) return null;
  try {
    const data = await readFile(path.join(process.cwd(), "public", publicPath));
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

function Frame({ children }: { children: ReactNode }) {
  const site = getSite();
  const { location, company } = getProfile();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `linear-gradient(112deg, ${COLORS.paper} 0%, #ffffff 30%, ${COLORS.paper} 45%, #fbfaf7 62%, ${COLORS.paper} 80%)`,
        color: COLORS.ink,
        padding: "56px 64px 52px",
        fontFamily: "Serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background: COLORS.card,
            borderRadius: 999,
            padding: "10px 26px",
            fontSize: 38,
            fontStyle: "italic",
            boxShadow: "0 10px 30px -12px rgba(18,20,17,.25)",
            border: `1px solid ${COLORS.line}`,
          }}
        >
          {site.name}
          <span style={{ color: COLORS.bright, fontStyle: "normal" }}>.</span>
        </div>
        <div style={{ display: "flex", fontFamily: "Sans", fontSize: 20, color: COLORS.soft, letterSpacing: 2 }}>
          {`${location.city}, ${location.country}`.toUpperCase()}
        </div>
      </div>
      {children}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Sans", fontSize: 21, color: COLORS.soft }}>
        <div style={{ display: "flex" }}>{new URL(site.url).host}</div>
        {company && <div style={{ display: "flex" }}>{`${company.label} ${company.name}`}</div>}
      </div>
    </div>
  );
}

function Headline({ value }: { value: Emphasis }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontSize: 118, lineHeight: 0.95, letterSpacing: -2 }}>
      {value.map((line, li) => (
        <div key={li} style={{ display: "flex", whiteSpace: "pre" }}>
          {line.map((segment, si) => (
            <span key={si} style={{ color: TONE_COLOR[segment.tone], fontStyle: segment.italic ? "italic" : "normal" }}>
              {segment.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export async function homeOgImage() {
  const profile = getProfile();
  const [fonts, portrait] = await Promise.all([loadFonts(), loadImage(profile.portrait)]);

  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <Headline value={getHomePage().hero.headline} />
          {portrait && (
            <div style={{ display: "flex", padding: 8, borderRadius: 999, background: COLORS.card, boxShadow: "0 30px 60px -24px rgba(18,20,17,.35)" }}>
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

export async function projectOgImage(project: Pick<Project, "title" | "year" | "tags" | "cover">) {
  const [fonts, cover] = await Promise.all([loadFonts(), project.cover ? loadImage(project.cover) : null]);
  const titleSize = project.title.length > 34 ? 84 : 104;

  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 22 }}>
            <div style={{ display: "flex", fontSize: 30, fontStyle: "italic", color: COLORS.mute }}>Case study · {project.year}</div>
            <div style={{ display: "flex", fontSize: titleSize, lineHeight: 0.95, letterSpacing: -1.5 }}>{project.title}</div>
            <div style={{ display: "flex", gap: 10, fontFamily: "Sans", fontSize: 20 }}>
              {project.tags.slice(0, 3).map((tag) => (
                <div key={tag} style={{ display: "flex", background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 999, padding: "6px 16px" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          {cover && (
            <div style={{ display: "flex", width: 360, height: 300, borderRadius: 28, overflow: "hidden", background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
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

/** Square brand mark: the first letter of the site name with an accent dot. */
export async function brandIcon(size: number) {
  const [serif] = await loadFonts();
  const letter = getSite().name.trim().charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: COLORS.ink,
          borderRadius: size * 0.22,
          color: COLORS.paper,
          fontFamily: "Serif",
          fontSize: size * 0.78,
          lineHeight: 1,
        }}
      >
        <span style={{ marginTop: -size * 0.06 }}>{letter}</span>
        <div
          style={{
            position: "absolute",
            right: size * 0.13,
            bottom: size * 0.16,
            width: size * 0.13,
            height: size * 0.13,
            borderRadius: 999,
            background: COLORS.bright,
          }}
        />
      </div>
    ),
    { width: size, height: size, fonts: [serif] },
  );
}
