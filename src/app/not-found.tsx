import type { Metadata } from "next";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Toned } from "@/components/ui/Toned";
import { getDictionary } from "@/i18n";

const t = getDictionary().notFound;

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="shell flex min-h-[82vh] flex-col items-center justify-center pt-32 text-center">
      <p className="enter-fade font-serif text-[clamp(6rem,22vw,16rem)] italic leading-none text-accent">{t.code}</p>
      <h1 className="enter-fade display-lg mt-4 max-w-[18ch]" style={{ "--d": 120 } as React.CSSProperties}>
        <Toned segments={t.title} />
      </h1>
      <div className="enter-fade mt-12 flex flex-wrap justify-center gap-3" style={{ "--d": 240 } as React.CSSProperties}>
        <MagneticButton href="/">{t.home}</MagneticButton>
        <MagneticButton href="/#work" variant="outline">
          {t.work}
        </MagneticButton>
      </div>
    </main>
  );
}
