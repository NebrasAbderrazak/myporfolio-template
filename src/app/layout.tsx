import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { sans, serif } from "./fonts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { contactChannels } from "@/content/channels";
import { getProfile, getSite } from "@/content/settings";
import { getDictionary } from "@/i18n";
import { utcOffsetLabel } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  const site = getSite();
  const profile = getProfile();
  return {
    ...pageMetadata({}),
    metadataBase: new URL(site.url),
    title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
    applicationName: site.name,
    authors: [{ name: profile.name, url: site.url }],
    creator: profile.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const t = getDictionary();
  const site = getSite();
  const profile = getProfile();
  const channels = contactChannels(profile);
  const { city, timeZone } = profile.location;

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh text-ink antialiased">
        <div aria-hidden className="beams" />
        <a
          href="#main"
          className="fixed left-4 top-3 z-[80] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-paper transition-transform focus:translate-y-0"
        >
          {t.nav.skip}
        </a>
        <Providers>
          <Header t={t.nav} brand={site.name} channels={channels} clock={{ city, timeZone, offset: utcOffsetLabel(timeZone) }} />
          {children}
          <Footer site={site} profile={profile} channels={channels} />
        </Providers>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
