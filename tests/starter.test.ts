import { beforeAll, describe, expect, it } from "vitest";

// The starter content is what a fresh clone of the template shows, so it must always be valid on its own.
describe("starter content", () => {
  beforeAll(() => {
    process.env.PORTFOLIO_CONTENT = "starter";
  });

  it("loads settings and pages without any content/ folder", async () => {
    const settings = await import("@/content/settings");
    expect(settings.getSite().name).toBe("Your Name");
    expect(() => [settings.getProfile(), settings.getHomePage(), settings.getWorkPage(), settings.getUpdatesPage()]).not.toThrow();
  });

  it("has example projects and updates", async () => {
    const { getProjects } = await import("@/content/projects");
    const { getUpdates } = await import("@/content/updates");
    expect(getProjects().length).toBeGreaterThan(0);
    expect(getProjects().every((project) => project.placeholder)).toBe(true);
    expect(getUpdates().length).toBeGreaterThan(0);
  });
});
