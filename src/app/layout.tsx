import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { sans, serif } from "./fonts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { getDictionary } from "@/i18n";
import { site } from "@/lib/site";

const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${t.meta.title}`,
    template: `%s | ${site.name}`,
  },
  description: t.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} | ${t.meta.title}`,
    description: t.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${t.meta.title}`,
    description: t.meta.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
          <Header
            t={t.nav}
            name={site.shortName}
            email={site.email}
            whatsapp={site.whatsapp}
            whatsappDisplay={site.whatsappDisplay}
            socials={site.socials}
            timeZone={site.location.timeZone}
          />
          {children}
          <Footer />
        </Providers>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
