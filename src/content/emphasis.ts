/**
 * Headings and short lines in the content files use a tiny inline syntax so
 * editors can style words without touching markup:
 *
 *   ~muted~   *italic*   ==accent==   \* literal marker
 *
 * Markers can be nested (`~*and*~`) and a line break starts a new line.
 */

export type Tone = "ink" | "mute" | "accent";

export type Segment = { text: string; tone: Tone; italic: boolean };

/** One entry per line. */
export type Emphasis = Segment[][];

/** A single word with its styling, and whether whitespace precedes it. */
export type Word = Segment & { spaced: boolean };

type Marker = "==" | "~" | "*";

function scan(line: string, onText: (char: string) => void, onMarker: (marker: Marker) => void) {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === "\\" && i + 1 < line.length) {
      onText(line[++i]);
    } else if (line.startsWith("==", i)) {
      onMarker("==");
      i++;
    } else if (char === "~" || char === "*") {
      onMarker(char);
    } else {
      onText(char);
    }
  }
}

function lines(source: string) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseLine(line: string): Segment[] {
  const segments: Segment[] = [];
  const open = { "==": false, "~": false, "*": false };
  let buffer = "";

  const flush = () => {
    if (!buffer) return;
    const tone: Tone = open["=="] ? "accent" : open["~"] ? "mute" : "ink";
    segments.push({ text: buffer, tone, italic: open["*"] });
    buffer = "";
  };

  scan(
    line,
    (char) => (buffer += char),
    (marker) => {
      flush();
      open[marker] = !open[marker];
    },
  );
  flush();
  return segments;
}

export function parseEmphasis(source: string): Emphasis {
  return lines(source).map(parseLine);
}

/** Returns the first marker left open on any line, or null when the source is well formed. */
export function findUnclosedMarker(source: string): Marker | null {
  for (const line of lines(source)) {
    const open = { "==": false, "~": false, "*": false };
    scan(
      line,
      () => {},
      (marker) => (open[marker] = !open[marker]),
    );
    const unclosed = (Object.keys(open) as Marker[]).find((marker) => open[marker]);
    if (unclosed) return unclosed;
  }
  return null;
}

export function plainEmphasis(value: Emphasis): string {
  return value
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function plainLine(text: string): Emphasis {
  return [[{ text, tone: "ink", italic: false }]];
}

export function toWords(line: Segment[]): Word[] {
  const words: Word[] = [];
  let pendingSpace = false;

  for (const segment of line) {
    for (const part of segment.text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        pendingSpace = true;
        continue;
      }
      words.push({ ...segment, text: part, spaced: words.length > 0 && pendingSpace });
      pendingSpace = false;
    }
  }
  return words;
}
