import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  href: string;
  /** Opens in a new tab with a safe rel. Defaults to true for http(s) links. */
  external?: boolean;
};

export function ExternalAnchor({ href, external = /^https?:\/\//.test(href), rel, ...rest }: Props) {
  const relValue = external ? ["noopener", "noreferrer", rel].filter(Boolean).join(" ") : rel;
  return <a href={href} {...(external ? { target: "_blank" } : {})} rel={relValue} {...rest} />;
}
