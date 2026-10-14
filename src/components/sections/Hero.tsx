import { Fragment, type CSSProperties } from "react";
import { Picture } from "@/components/media/Picture";
import { HeroExit } from "@/components/motion/HeroExit";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { LocalTime } from "@/components/ui/LocalTime";
import { Toned } from "@/components/ui/Toned";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { HeroPortrait } from "./HeroPortrait";

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export function Hero() {
  const t = getDictionary().hero;

  return (
    <section aria-labelledby="hero-title" className="relative pt-32 md:pt-40">
      <HeroExit>
        <div className="shell flex flex-col items-center text-center">
          <HeroPortrait>
            <Picture
              src="/me.jpg"
              alt={t.portraitAlt}
              fill
              sizes="(min-width: 768px) 200px, 152px"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </HeroPortrait>

          <h1 id="hero-title" className="display-xl mt-10 md:mt-12">
            {t.headline.map((line, li) => {
              const first = t.headline.slice(0, li).reduce((n, l) => n + l.length, 0);
              return (
                <span key={li} className="blur-words block">
                  {line.map((seg, si) => (
                    <Fragment key={si}>
                      {si > 0 && " "}
                      <span className={cn("w", `tone-${seg.tone}`, seg.italic && "italic")} style={delay(120 + (first + si) * 75)}>
                        {seg.text}
                      </span>
                    </Fragment>
                  ))}
                </span>
              );
            })}
          </h1>

          <p
            data-tones="small"
            className="enter-fade mt-8 max-w-[24rem] text-[1.1rem] leading-relaxed sm:max-w-[36rem] md:mt-10 md:text-[1.3rem]"
            style={delay(560)}
          >
            <Toned segments={t.sub} />
          </p>

          <div className="enter-fade mt-10 flex flex-wrap justify-center gap-3" style={delay(660)}>
            <MagneticButton href="#work" icon="arrow-down">
              {t.ctaWork}
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              {t.ctaContact}
            </MagneticButton>
          </div>

          <ul className="enter-fade mt-14 flex flex-wrap justify-center gap-2.5 md:mt-16" style={delay(780)}>
            <li className="pill">
              <svg viewBox="0 0 24 24" className="size-4 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
              {site.location.city}, {site.location.country}
            </li>
            <li className="pill tabular-nums">
              <svg viewBox="0 0 24 24" className="size-4 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" strokeLinecap="round" />
              </svg>
              <LocalTime timeZone={site.location.timeZone} />
              <span className="text-ink-faint">GMT+1</span>
            </li>
            <li className="pill">
              <span aria-hidden className="status-dot relative size-2 rounded-full bg-accent-bright" />
              {t.status.now}
            </li>
          </ul>
        </div>
      </HeroExit>
    </section>
  );
}
