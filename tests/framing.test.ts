import { describe, expect, it } from "vitest";
import { placeImage } from "@/lib/framing";

const tall = { width: 720, height: 1280 };

describe("placeImage", () => {
  it("fills a square frame edge to edge at zoom 1", () => {
    const placed = placeImage({ width: 800, height: 800 }, { x: 50, y: 50, zoom: 1 });
    expect(placed).toEqual({ left: 0, top: 0, width: 1, height: 1 });
  });

  it("covers the frame with a tall image and moves it to the focus point", () => {
    const placed = placeImage(tall, { x: 50, y: 60, zoom: 1 });
    expect(placed.width).toBe(1);
    expect(placed.height).toBeCloseTo(1280 / 720);
    expect(placed.top).toBeLessThan(0);
  });

  it("never leaves a gap at the edges", () => {
    for (const x of [0, 100]) {
      for (const y of [0, 100]) {
        const p = placeImage(tall, { x, y, zoom: 2 });
        expect(p.left).toBeLessThanOrEqual(0);
        expect(p.top).toBeLessThanOrEqual(0);
        expect(p.left + p.width).toBeGreaterThanOrEqual(1);
        expect(p.top + p.height).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("centres the focus point when there is room", () => {
    const p = placeImage(tall, { x: 60, y: 25, zoom: 1.4 });
    expect(p.left + 0.6 * p.width).toBeCloseTo(0.5);
    expect(p.top + 0.25 * p.height).toBeCloseTo(0.5);
  });

  it("covers wide frames with wide images", () => {
    const p = placeImage({ width: 1600, height: 900 }, { x: 50, y: 50, zoom: 1 }, 1);
    expect(p.height).toBeCloseTo(1);
    expect(p.width).toBeCloseTo(1600 / 900);
  });
});
