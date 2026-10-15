import Link from "next/link";
import { BlurWords } from "@/components/motion/BlurWords";
import { ExpandPanel, RisingWordmark } from "@/components/motion/ExpandPanel";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Overline } from "@/components/motion/Overline";
import { BackToTop } from "@/components/ui/BackToTop";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ExternalAnchor } from "@/components/ui/ExternalAnchor";
import { Icon } from "@/components/ui/Icon";
import type { Channel } from "@/content/channels";
import type { Profile, Site } from "@/content/schema";
import { getDictionary } from "@/i18n";

type Props = {
  site: Site;
  profile: Profile;
  channels: Channel[];
};

export function Footer({ site, profile, channels }: Props) {
  const t = getDictionary().contact;
  const { contact } = site;
  const whatsapp = channels.find((channel) => channel.icon === "whatsapp");
  const year = new Date().getFullYear();

  return (
    <footer id="contact" aria-labelledby="contact-title" className="mt-28 md:mt-40">
      <ExpandPanel className="on-dark relative overflow-hidden rounded-t-[2rem] bg-ink text-paper md:rounded-none">
        <div aria-hidden className="beams-dark" />

        <div className="shell relative flex flex-col items-center pb-16 pt-24 text-center md:pb-24 md:pt-36">
          <Overline dark>{contact.overline}</Overline>
          <h2 id="contact-title" className="display-xl mt-8 md:mt-10">
            <BlurWords value={contact.title} />
          </h2>
          {contact.intro && <p className="mt-7 max-w-md text-[1.08rem] text-white/60 md:text-[1.15rem]">{contact.intro}</p>}
          <div className="mt-10">
            <MagneticButton
              href={whatsapp?.href ?? `mailto:${profile.email}`}
              external={Boolean(whatsapp)}
              variant="light"
              halo
              icon="arrow-up-right"
            >
              {whatsapp ? contact.button : t.emailButton}
            </MagneticButton>
          </div>
          <div className="mt-9 text-white/85">
            <CopyEmail email={profile.email} copy={t.copy} copied={t.copied} />
          </div>
        </div>

        <div className="shell relative">
          <div className="flex flex-col items-center gap-7 border-t border-white/10 py-8 md:flex-row md:justify-between">
            <Link
              href="/"
              transitionTypes={["page-back"]}
              className="rounded-full bg-paper px-6 py-2.5 font-serif text-[1.6rem] italic leading-none text-ink transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
            >
              {site.name}
              <span className="not-italic text-accent-bright">.</span>
            </Link>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <ExternalAnchor
                    href={channel.href}
                    external={channel.external}
                    rel="me"
                    aria-label={channel.label}
                    className="grid size-12 place-items-center rounded-full border border-white/15 text-white/80 transition-[background-color,color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:bg-paper hover:text-ink md:size-14"
                  >
                    <Icon name={channel.icon} className="size-[1.15rem]" />
                  </ExternalAnchor>
                </li>
              ))}
            </ul>
            {profile.company && <CompanyCredit company={profile.company} />}
          </div>
          <div className="flex flex-col items-center justify-between gap-2 pb-2 text-[0.85rem] text-white/45 md:flex-row">
            <p>
              © {year} {profile.name}.{site.footer.credit && ` ${site.footer.credit}`}
            </p>
            <BackToTop label={t.top} />
          </div>
        </div>

        <RisingWordmark text={site.name} />
      </ExpandPanel>
    </footer>
  );
}

function CompanyCredit({ company }: { company: NonNullable<Profile["company"]> }) {
  const name = <span className="link-line">{company.name}</span>;
  return (
    <p className="font-serif text-[1.45rem] leading-none">
      <span className="text-white/50">{company.label} </span>
      {company.url ? (
        <ExternalAnchor href={company.url} className="group inline-flex items-baseline gap-1 italic">
          {name}
          <Icon
            name="arrow-up-right"
            className="size-4 text-accent-bright transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </ExternalAnchor>
      ) : (
        <span className="italic">{company.name}</span>
      )}
    </p>
  );
}
