import Link from "next/link";
import { BlurWords } from "@/components/motion/BlurWords";
import { ExpandPanel, RisingWordmark } from "@/components/motion/ExpandPanel";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Overline } from "@/components/motion/Overline";
import { BackToTop } from "@/components/ui/BackToTop";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/i18n";
import { site } from "@/lib/site";

export function Footer() {
  const t = getDictionary().contact;
  const year = new Date().getFullYear();
  const channels = [
    { label: "WhatsApp", icon: "whatsapp" as const, href: site.whatsapp },
    { label: "Email", icon: "email" as const, href: `mailto:${site.email}` },
    ...site.socials,
  ];

  return (
    <footer id="contact" aria-labelledby="contact-title" className="mt-28 md:mt-40">
      <ExpandPanel className="on-dark relative overflow-hidden rounded-t-[2rem] bg-ink text-paper md:rounded-none">
        <div aria-hidden className="beams-dark" />

        <div className="shell relative flex flex-col items-center pb-16 pt-24 text-center md:pb-24 md:pt-36">
          <Overline dark>{t.overline}</Overline>
          <h2 id="contact-title" className="display-xl mt-8 md:mt-10">
            <BlurWords lines={t.title} />
          </h2>
          <p className="mt-7 max-w-md text-[1.08rem] text-white/60 md:text-[1.15rem]">{t.intro}</p>
          <div className="mt-10">
            <MagneticButton href={site.whatsapp} external variant="light" halo icon="arrow-up-right">
              {t.whatsapp}
            </MagneticButton>
          </div>
          <div className="mt-9 text-white/85">
            <CopyEmail email={site.email} copy={t.copy} copied={t.copied} />
          </div>
        </div>

        <div className="shell relative">
          <div className="flex flex-col items-center gap-7 border-t border-white/10 py-8 md:flex-row md:justify-between">
            <Link
              href="/"
              transitionTypes={["page-back"]}
              className="rounded-full bg-paper px-6 py-2.5 font-serif text-[1.6rem] italic leading-none text-ink transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
            >
              {site.shortName}
              <span className="not-italic text-accent-bright">.</span>
            </Link>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
                    aria-label={c.label}
                    className="grid size-12 place-items-center rounded-full border border-white/15 text-white/80 transition-[background-color,color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:bg-paper hover:text-ink md:size-14"
                  >
                    <Icon name={c.icon} className="size-[1.15rem]" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-serif text-[1.45rem] leading-none">
              <span className="text-white/50">{t.founder} </span>
              <a
                href={site.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1 italic"
              >
                <span className="link-line">{site.company.name}</span>
                <Icon
                  name="arrow-up-right"
                  className="size-4 text-accent-bright transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-2 pb-2 text-[0.85rem] text-white/45 md:flex-row">
            <p>
              © {year} {site.name}. {t.built}
            </p>
            <BackToTop label={t.top} />
          </div>
        </div>

        <RisingWordmark text={site.shortName} />
      </ExpandPanel>
    </footer>
  );
}
