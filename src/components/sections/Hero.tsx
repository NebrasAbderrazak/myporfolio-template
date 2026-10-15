import type { CSSProperties } from "react";
import { Picture } from "@/components/media/Picture";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollAway } from "@/components/motion/ScrollAway";
import { EnterWords } from "@/components/typography/EnterWords";
import { Toned } from "@/components/typography/Toned";
import { Icon } from "@/components/ui/Icon";
import { LocalTime } from "@/components/ui/LocalTime";
import type { HomePage, Profile } from "@/content/schema";
import { utcOffsetLabel } from "@/lib/format";
import { HeroPortrait } from "./HeroPortrait";

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

type Props = {
  content: HomePage["hero"];
  profile: Profile;
};

export function Hero({ content, profile }: Props) {
  const { location } = profile;

  return (
    <section aria-labelledby="hero-title" className="relative pt-32 md:pt-40">
      <ScrollAway>
        <div className="shell flex flex-col items-center text-center">
          <HeroPortrait>
            <Picture
              src={profile.portrait}
              alt={profile.portraitAlt ?? profile.name}
              fill
              sizes="(min-width: 768px) 200px, 152px"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </HeroPortrait>

          <h1 id="hero-title" className="display-xl mt-10 md:mt-12">
            <EnterWords value={content.headline} delay={120} />
          </h1>

          <p
            data-tones="small"
            className="enter-fade mt-8 max-w-[24rem] text-[1.1rem] leading-relaxed sm:max-w-[36rem] md:mt-10 md:text-[1.3rem]"
            style={delay(560)}
          >
            <Toned value={content.intro} />
          </p>

          <div className="enter-fade mt-10 flex flex-wrap justify-center gap-3" style={delay(660)}>
            <MagneticButton href="#work" icon="arrow-down">
              {content.primaryButton}
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              {content.secondaryButton}
            </MagneticButton>
          </div>

          <ul className="enter-fade mt-14 flex flex-wrap justify-center gap-2.5 md:mt-16" style={delay(780)}>
            <li className="pill">
              <Icon name="pin" className="size-4 text-accent" />
              {location.city}, {location.country}
            </li>
            <li className="pill tabular-nums">
              <Icon name="clock" className="size-4 text-accent" />
              <LocalTime timeZone={location.timeZone} />
              <span className="text-ink-faint">{utcOffsetLabel(location.timeZone)}</span>
            </li>
            {profile.status && (
              <li className="pill">
                <span aria-hidden className="status-dot relative size-2 rounded-full bg-accent-bright" />
                {profile.status}
              </li>
            )}
          </ul>
        </div>
      </ScrollAway>
    </section>
  );
}
