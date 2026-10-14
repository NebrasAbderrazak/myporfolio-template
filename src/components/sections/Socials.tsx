import { BlurWords } from "@/components/motion/BlurWords";
import { Overline } from "@/components/motion/Overline";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/i18n";
import { site, type IconName } from "@/lib/site";

export function Socials() {
  const t = getDictionary().socials;
  const channels: { label: string; icon: IconName; href: string; handle: string; action: string }[] = [
    { label: "WhatsApp", icon: "whatsapp", href: site.whatsapp, handle: site.whatsappDisplay, action: t.message },
    { label: "Email", icon: "email", href: `mailto:${site.email}`, handle: site.email, action: t.write },
    ...site.socials.map((s) => ({ ...s, action: t.follow })),
  ];

  return (
    <section id="elsewhere" aria-labelledby="elsewhere-title" className="shell pt-32 md:pt-52">
      <Overline>{t.overline}</Overline>
      <h2 id="elsewhere-title" className="display-lg mt-6 text-center">
        <BlurWords lines={[t.title]} />
      </h2>

      <RevealGroup as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-5" stagger={0.07}>
        {channels.map((c) => (
          <RevealItem as="li" key={c.label}>
            <a
              href={c.href}
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
              className="group relative flex h-full flex-col justify-between gap-12 overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-soft ring-1 ring-black/[0.05] transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-lift md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-paper text-ink ring-1 ring-black/[0.06] transition-[background-color,color] duration-500 group-hover:bg-ink group-hover:text-paper">
                  <Icon name={c.icon} className="size-6" />
                </span>
                <span className="grid size-10 place-items-center rounded-full ring-1 ring-black/10 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                  <Icon name="arrow-up-right" className="size-4" />
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-[2.4rem] leading-none tracking-[-0.01em]">{c.label}</p>
                  <p className="mt-2 truncate text-[0.95rem] text-ink-faint">{c.handle}</p>
                </div>
                <span className="pill shrink-0 !bg-ink !text-paper !text-[0.85rem]">{c.action}</span>
              </div>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
