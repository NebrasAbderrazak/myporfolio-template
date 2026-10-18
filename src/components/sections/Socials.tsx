import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ExternalAnchor } from "@/components/ui/ExternalAnchor";
import { Icon } from "@/components/ui/Icon";
import type { Channel } from "@/content/channels";
import type { HomePage } from "@/content/schema";
import { getDictionary } from "@/i18n";
import { SectionHeading } from "./SectionHeading";

export function Socials({ content, channels }: { content: HomePage["socials"]; channels: Channel[] }) {
  const t = getDictionary().channels;
  const action = (channel: Channel) => (channel.kind === "social" ? t.follow : channel.icon === "email" ? t.write : t.message);

  return (
    <section id="elsewhere" aria-labelledby="elsewhere-title" className="shell pt-32 md:pt-52">
      <SectionHeading id="elsewhere-title" title={content.title} />

      <RevealGroup as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-5" stagger={0.07}>
        {channels.map((channel) => (
          <RevealItem as="li" key={channel.href}>
            <ExternalAnchor
              href={channel.href}
              external={channel.external}
              rel="me"
              className="group relative flex h-full flex-col justify-between gap-12 overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-soft ring-1 ring-black/[0.05] transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-lift md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-paper text-ink ring-1 ring-black/[0.06] transition-[background-color,color] duration-500 group-hover:bg-ink group-hover:text-paper">
                  <Icon name={channel.icon} className="size-6" />
                </span>
                <span className="grid size-10 place-items-center rounded-full ring-1 ring-black/10 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                  <Icon name="arrow-up-right" className="size-4" />
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-[2.4rem] leading-none tracking-[-0.01em]">{channel.label}</p>
                  <p className="mt-2 truncate text-[0.95rem] text-ink-faint">{channel.handle}</p>
                </div>
                <span className="pill shrink-0 !bg-ink !text-paper !text-[0.85rem]">{action(channel)}</span>
              </div>
            </ExternalAnchor>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
