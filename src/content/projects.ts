import "server-only";
import { cache } from "react";
import { projectSchema } from "./schema";
import { readCollection, resolveAsset } from "./source";

const showDrafts = process.env.NODE_ENV === "development";

const newestFirst = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

function readProjects(dir: string) {
  return readCollection(dir, projectSchema)
    .filter((project) => showDrafts || !project.draft)
    .map((project) => ({
      ...project,
      year: project.date.slice(0, 4),
      cover: resolveAsset(project.cover, project.file),
      coverAlt: project.coverAlt ?? `${project.title}, screenshot`,
      icon: resolveAsset(project.icon, project.file),
    }))
    .sort(newestFirst);
}

export const getProjects = cache(() => readProjects("projects"));

/** Personal builds and experiments, kept apart from client work. They have no pages of their own. */
export const getSideProjects = cache(() => readProjects("side-projects"));

export type Project = ReturnType<typeof getProjects>[number];

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}

/** Featured projects, or the newest ones when nothing is marked as featured. */
export function getFeaturedProjects(limit: number) {
  const projects = getProjects();
  const featured = projects.filter((project) => project.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}

/** The projects that follow `slug` in date order, wrapping around to the newest. */
export function getNextProjects(slug: string, count: number) {
  const projects = getProjects();
  const start = projects.findIndex((project) => project.slug === slug);
  return Array.from({ length: Math.min(count, projects.length - 1) }, (_, i) => projects[(start + i + 1) % projects.length]);
}
