import "server-only";
import { cache } from "react";
import { homePageSchema, listingPageSchema, profileSchema, siteSchema } from "./schema";
import { readDocument, requireAsset, warnOnce } from "./source";

const PLACEHOLDER_DOMAIN = /(^|\.)example\.(com|org|net)$/i;

export const getSite = cache(() => {
  const site = readDocument("settings/site.json", siteSchema);
  if (PLACEHOLDER_DOMAIN.test(new URL(site.url).hostname)) {
    warnOnce(`content/settings/site.json: "url" is still ${site.url}. Set your real domain before deploying.`);
  }
  return site;
});

export const getProfile = cache(() => {
  const file = "settings/profile.json";
  const profile = readDocument(file, profileSchema);
  if (PLACEHOLDER_DOMAIN.test(profile.email.split("@")[1] ?? "")) {
    warnOnce(`content/${file}: "email" is still ${profile.email}. Set your real address before deploying.`);
  }
  return { ...profile, portrait: requireAsset(profile.portrait, file) };
});

export const getHomePage = cache(() => readDocument("pages/home.json", homePageSchema));

export const getWorkPage = cache(() => readDocument("pages/work.json", listingPageSchema));

export const getUpdatesPage = cache(() => readDocument("pages/updates.json", listingPageSchema));

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, getSite().url).toString();
}
