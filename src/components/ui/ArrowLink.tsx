import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Props = {
  href: string;
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
};

/** Pill link with a round arrow that turns on hover. Navigates with the forward page transition. */
export function ArrowLink({ href, children, size = "md", className }: Props) {
  return (
    <Link
      href={href}
      transitionTypes={["page-forward"]}
      className={cn(
        "pill group !gap-3 transition-transform duration-500 ease-out-expo hover:-translate-y-0.5",
        size === "lg" ? "!py-3 !pl-5 !pr-4 !text-[1rem]" : "!py-2.5 !pl-5 !pr-3",
        className,
      )}
    >
      {children}
      <span className="grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]">
        <Icon name="arrow-right" className="size-3.5" />
      </span>
    </Link>
  );
}
