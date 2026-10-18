import type { ReactElement, SVGProps } from "react";

const filled = { fill: "currentColor" } satisfies SVGProps<SVGSVGElement>;
const stroked = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} satisfies SVGProps<SVGSVGElement>;

const ICONS = {
  github: [
    filled,
    <path
      key="p"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />,
  ],
  linkedin: [
    filled,
    <path
      key="p"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />,
  ],
  x: [
    filled,
    <path
      key="p"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />,
  ],
  instagram: [
    { ...stroked, strokeWidth: 2 },
    <rect key="r" x="2.5" y="2.5" width="19" height="19" rx="5.5" />,
    <circle key="c" cx="12" cy="12" r="4.3" />,
    <circle key="d" cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />,
  ],
  whatsapp: [
    { ...stroked, strokeWidth: 1.9 },
    <path key="b" d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.6z" />,
    <path
      key="p"
      d="M9 8.2c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.5.3-1.3.6-2.2.4-2.6-.6-4.9-2.9-5.5-5.5-.2-.9.1-1.7.4-2.2z"
      fill="currentColor"
      stroke="none"
    />,
  ],
  email: [stroked, <rect key="r" x="2.75" y="4.75" width="18.5" height="14.5" rx="3" />, <path key="p" d="m3.5 6.5 8.5 6.5 8.5-6.5" />],
  globe: [
    stroked,
    <circle key="c" cx="12" cy="12" r="9" />,
    <path key="p" d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z" />,
  ],
  link: [
    stroked,
    <path key="a" d="M10 13.5a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" />,
    <path key="b" d="M14 10.5a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />,
  ],
  copy: [
    stroked,
    <rect key="r" x="8.5" y="8.5" width="12" height="12" rx="2.5" />,
    <path key="p" d="M15.5 5.5v-.5a2 2 0 0 0-2-2H5.5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h.5" />,
  ],
  pin: [
    stroked,
    <path key="p" d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />,
    <circle key="c" cx="12" cy="10" r="2.3" />,
  ],
  clock: [stroked, <circle key="c" cx="12" cy="12" r="8.5" />, <path key="p" d="M12 7.5V12l3 2" />],
  "arrow-up-right": [stroked, <path key="p" d="M7 17 17 7M8.5 7H17v8.5" />],
  "arrow-right": [stroked, <path key="p" d="M4 12h15M13 6l6 6-6 6" />],
  "arrow-left": [stroked, <path key="p" d="M20 12H5M11 6l-6 6 6 6" />],
  "arrow-up": [stroked, <path key="p" d="M12 20V5M6 11l6-6 6 6" />],
  "arrow-down": [stroked, <path key="p" d="M12 4v15M6 13l6 6 6-6" />],
} satisfies Record<string, [SVGProps<SVGSVGElement>, ...ReactElement[]]>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "size-[1em]" }: { name: IconName; className?: string }) {
  const [props, ...shapes] = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable={false} {...props}>
      {shapes}
    </svg>
  );
}
