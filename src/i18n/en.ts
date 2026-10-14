export type Tone = "ink" | "mute" | "accent";
export type Segment = { text: string; tone: Tone; italic?: boolean };

export const en = {
  meta: {
    title: "Developer, builder and founder in Gabès, Tunisia",
    description:
      "Self-taught developer in Gabès, Tunisia. I build, deploy and ship software for real businesses. Founder of Jasper Tech.",
  },
  nav: {
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    home: "Home",
    talk: "Let’s talk",
    links: [
      { id: "work", label: "Work" },
      { id: "about", label: "About" },
      { id: "toolbox", label: "Toolbox" },
      { id: "updates", label: "Updates" },
      { id: "contact", label: "Contact" },
    ],
    getInTouch: "Get in touch",
    elsewhere: "Elsewhere",
    localTime: "Local time in Gabès",
  },
  hero: {
    headline: [
      [
        { text: "I’m a", tone: "mute" },
        { text: "Developer,", tone: "ink" },
      ],
      [
        { text: "Builder", tone: "ink" },
        { text: "and", tone: "mute", italic: true },
        { text: "Founder", tone: "accent", italic: true },
      ],
    ] as Segment[][],
    sub: [
      { text: "Self-taught in ", tone: "mute" },
      { text: "Gabès, Tunisia.", tone: "ink" },
      { text: " I build, deploy and ship software for ", tone: "mute" },
      { text: "real businesses.", tone: "ink" },
    ] as Segment[],
    ctaWork: "See my work",
    ctaContact: "Contact me",
    portraitAlt: "Portrait of Nebras",
    status: {
      now: "Building Jasper Tech",
    },
  },
  work: {
    overline: "Selected work",
    title: [
      { text: "Things I’ve ", tone: "ink" },
      { text: "built & shipped", tone: "mute", italic: true },
    ] as Segment[],
    viewAll: "All projects",
    placeholder: "Placeholder",
    cursor: "View project",
  },
  workIndex: {
    overline: "Work",
    title: [
      { text: "All ", tone: "ink" },
      { text: "projects", tone: "mute", italic: true },
    ] as Segment[],
    intro: "Everything I’ve built and shipped, newest first.",
  },
  caseStudy: {
    back: "All work",
    year: "Year",
    liveLink: "Live link",
    contact: "Contact me",
    mission: "Mission",
    builtWith: "Built with",
    role: "My role",
    seeAlso: "See also",
    more: [
      { text: "More ", tone: "ink" },
      { text: "projects", tone: "mute", italic: true },
    ] as Segment[],
  },
  about: {
    overline: "About me",
    // PLACEHOLDER: rewrite in your own voice. Words light up one by one as you scroll.
    statement:
      "I’m a self-taught developer from Gabès, in the south of Tunisia. I learned by building real things for real people, and I still work that way: I design it, build it, put it on a server and keep it running. Today I do that for businesses through Jasper Tech.",
    facts: [
      { label: "Based in", value: "Gabès, Tunisia" },
      { label: "Founder of", value: "Jasper Tech" },
      { label: "I work on", value: "Websites, business software and deployment" },
    ],
  },
  toolbox: {
    overline: "Toolbox",
    title: [
      { text: "The stack ", tone: "ink" },
      { text: "behind the work", tone: "mute", italic: true },
    ] as Segment[],
    intro: "No skill bars. Just the tools I reach for, and what I use each one for.",
    marquee: ["PHP", "JavaScript", "React", "Python", "HTML & CSS", "VPS & deployment", "APIs", "AI-assisted development"],
    groups: [
      {
        name: "Build",
        items: [
          { name: "PHP", note: "Business websites, back offices and the logic behind them." },
          { name: "JavaScript", note: "Interactions, front-end logic and small browser tools." },
          { name: "React", note: "Interfaces with a lot of state, like dashboards and admin panels." },
          { name: "Python", note: "Scripts, automation and the jobs nobody wants to do by hand." },
          { name: "HTML & CSS", note: "Clean markup and layouts that hold up on every screen." },
        ],
      },
      {
        name: "Ship",
        items: [
          { name: "VPS & deployment", note: "Linux servers, nginx, SSL and backups. I deploy my own work." },
          { name: "APIs", note: "Connecting payments, messaging and third-party services." },
        ],
      },
      {
        name: "Think",
        items: [
          { name: "AI-assisted development", note: "Using AI to move faster, while reviewing every line that ships." },
        ],
      },
    ],
  },
  updates: {
    overline: "Updates",
    title: [
      { text: "Notes from ", tone: "ink" },
      { text: "the workbench", tone: "mute", italic: true },
    ] as Segment[],
    intro: "Short posts about what I’m building, shipping and learning.",
    all: "All updates",
    pageTitle: "Updates",
    pageIntro: "What I’m building, in short posts. Newest first.",
    latest: "Latest",
  },
  socials: {
    overline: "Elsewhere",
    title: [
      { text: "Find me ", tone: "ink" },
      { text: "here", tone: "mute", italic: true },
    ] as Segment[],
    follow: "Follow",
    message: "Message",
    write: "Write",
  },
  contact: {
    overline: "Contact",
    title: [
      [{ text: "Have something", tone: "ink" }],
      [
        { text: "to build?", tone: "ink" },
        { text: "Let’s talk.", tone: "mute", italic: true },
      ],
    ] as Segment[][],
    intro: "WhatsApp is the fastest way to reach me. Email works too.",
    whatsapp: "Message me on WhatsApp",
    copy: "Copy email",
    copied: "Copied",
    founder: "Founder of",
    built: "Designed and built in Gabès, Tunisia.",
    top: "Back to top",
  },
  notFound: {
    code: "404",
    title: [
      { text: "This page doesn’t exist, ", tone: "ink" },
      { text: "or it moved.", tone: "mute", italic: true },
    ] as Segment[],
    home: "Back home",
    work: "See my work",
  },
};

export type Dictionary = typeof en;
