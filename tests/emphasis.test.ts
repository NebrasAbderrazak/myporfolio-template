import { describe, expect, it } from "vitest";
import { findUnclosedMarker, parseEmphasis, plainEmphasis, toWords } from "@/content/emphasis";

describe("parseEmphasis", () => {
  it("returns plain ink text when there are no markers", () => {
    expect(parseEmphasis("Hello there")).toEqual([[{ text: "Hello there", tone: "ink", italic: false }]]);
  });

  it("applies muted, italic and accent markers", () => {
    expect(parseEmphasis("~I’m a~ Developer ==*Founder*==")).toEqual([
      [
        { text: "I’m a", tone: "mute", italic: false },
        { text: " Developer ", tone: "ink", italic: false },
        { text: "Founder", tone: "accent", italic: true },
      ],
    ]);
  });

  it("supports nested markers in any order", () => {
    expect(parseEmphasis("*~and~*")).toEqual(parseEmphasis("~*and*~"));
  });

  it("splits lines and ignores blank ones", () => {
    expect(parseEmphasis("One\n\n  Two  ")).toHaveLength(2);
  });

  it("treats escaped markers as text", () => {
    expect(parseEmphasis(String.raw`5 \* 3`)).toEqual([[{ text: "5 * 3", tone: "ink", italic: false }]]);
  });
});

describe("findUnclosedMarker", () => {
  it("accepts balanced markers", () => {
    expect(findUnclosedMarker("~a~ *b* ==c==")).toBeNull();
  });

  it("reports the marker that is left open", () => {
    expect(findUnclosedMarker("Things I’ve ~built")).toBe("~");
  });

  it("checks each line on its own", () => {
    expect(findUnclosedMarker("*open\nclose*")).toBe("*");
  });
});

describe("toWords", () => {
  it("keeps the spacing between words across segments", () => {
    const words = toWords(parseEmphasis("~I’m a~ Developer,")[0]);
    expect(words.map((word) => [word.text, word.spaced, word.tone])).toEqual([
      ["I’m", false, "mute"],
      ["a", true, "mute"],
      ["Developer,", true, "ink"],
    ]);
  });

  it("does not add a space where segments touch", () => {
    const words = toWords(parseEmphasis("~built~,")[0]);
    expect(words.map((word) => word.spaced)).toEqual([false, false]);
  });
});

describe("plainEmphasis", () => {
  it("joins lines into one sentence", () => {
    expect(plainEmphasis(parseEmphasis("Have something\nto build? ~*Let’s talk.*~"))).toBe("Have something to build? Let’s talk.");
  });
});
