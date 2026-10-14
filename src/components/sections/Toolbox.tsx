import { BlurWords } from "@/components/motion/BlurWords";
import { Marquee } from "@/components/motion/Marquee";
import { Overline } from "@/components/motion/Overline";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";

export function Toolbox() {
  const t = getDictionary().toolbox;

  return (
    <section id="toolbox" aria-labelledby="toolbox-title" className="pt-32 md:pt-52">
      <div className="shell grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-8">
          <Overline align="left">{t.overline}</Overline>
          <h2 id="toolbox-title" className="display-lg mt-6">
            <BlurWords lines={[t.title]} />
          </h2>
        </div>
        <Reveal className="md:col-span-4" delay={0.15}>
          <p className="max-w-sm text-[1.05rem] text-ink-soft md:ml-auto">{t.intro}</p>
        </Reveal>
      </div>

      <div aria-hidden className="mt-14 space-y-1 font-serif text-[clamp(3.2rem,8.5vw,8rem)] leading-[1.1] tracking-[-0.02em] md:mt-20">
        <Marquee items={t.marquee} direction={1} />
        <Marquee items={[...t.marquee].reverse()} direction={-1} italic className="text-mute" />
      </div>

      <div className="shell mt-16 md:mt-24">
        <div className="grid gap-12 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
          {t.groups.map((group) => (
            <div key={group.name}>
              <h3 className="font-serif text-[2rem] italic leading-none text-mute">{group.name}</h3>
              <RevealGroup as="ul" className="mt-6 space-y-6" stagger={0.07}>
                {group.items.map((item) => (
                  <RevealItem as="li" key={item.name} className="group">
                    <p className="flex items-center gap-2.5 text-[1.15rem] font-medium tracking-[-0.01em] text-ink">
                      <span aria-hidden className="size-1.5 rounded-full bg-accent-bright transition-transform duration-500 group-hover:scale-150" />
                      {item.name}
                    </p>
                    <p className="mt-1 pl-4 text-[0.98rem] leading-relaxed text-ink-soft">{item.note}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
