import { describe, expect, it } from "vitest";
import { getProjects } from "@/content/projects";
import { getHomePage, getProfile, getSite, getUpdatesPage, getWorkPage } from "@/content/settings";
import { getUpdates } from "@/content/updates";

// Loads the real files in /content, so a bad edit from the admin panel fails CI instead of the deploy.
describe("repository content", () => {
  it("has valid settings and pages", () => {
    expect(() => [getSite(), getProfile(), getHomePage(), getWorkPage(), getUpdatesPage()]).not.toThrow();
  });

  it("has valid projects with unique slugs", () => {
    const slugs = getProjects().map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has valid updates", () => {
    expect(() => getUpdates()).not.toThrow();
  });
});
