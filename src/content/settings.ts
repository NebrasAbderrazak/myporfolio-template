import "server-only";
import { cache } from "react";
import { homePageSchema, listingPageSchema, nowSchema, profileSchema, sideProjectsSchema, siteSchema } from "./schema";
import { isStarter, readDocument, requireAsset, warnOnce } from "./source";

const PLACEHOLDER_DOMAIN = /(^|\.)example\.(com|org|net)$/i;
const SITE = "settings/site.json";
const PROFILE = "settings/profile.json";

export const getSite = cache(() => {
  const site = readDocument(SITE, siteSchema);
  if (!isStarter(SITE) && PLACEHOLDER_DOMAIN.test(new URL(site.url).hostname)) {
    warnOnce(`content/${SITE}: "url" is still ${site.url}. Set your real domain before deploying.`);
  }
  return site;
});

export const getProfile = cache(() => {
  const profile = readDocument(PROFILE, profileSchema);
  if (!isStarter(PROFILE) && PLACEHOLDER_DOMAIN.test(profile.email.split("@")[1] ?? "")) {
    warnOnce(`content/${PROFILE}: "email" is still ${profile.email}. Set your real address before deploying.`);
  }
  return { ...profile, portrait: requireAsset(profile.portrait, PROFILE) };
});

export const getHomePage = cache(() => readDocument("pages/home.json", homePageSchema));

export const getWorkPage = cache(() => readDocument("pages/work.json", listingPageSchema));

export const getUpdatesPage = cache(() => readDocument("pages/updates.json", listingPageSchema));

export const getNow = cache(() => readDocument("pages/now.json", nowSchema));

export const getSideProjectsPage = cache(() => readDocument("pages/side-projects.json", sideProjectsSchema));

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, getSite().url).toString();
}
