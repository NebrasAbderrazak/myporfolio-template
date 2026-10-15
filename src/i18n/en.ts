/**
 * Interface strings: buttons, labels and accessibility text.
 * Anything about the site owner lives in /content and is edited from the admin panel.
 */
export const en = {
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
    localTime: "Local time in",
  },
  work: {
    viewAll: "All projects",
    placeholder: "Placeholder",
    cursor: "View project",
    tags: "Tags",
  },
  caseStudy: {
    back: "All work",
    liveLink: "Live link",
    contact: "Contact me",
    mission: "Mission",
    builtWith: "Built with",
    role: "My role",
    seeAlso: "See also",
    more: "More ~*projects*~",
  },
  updates: {
    all: "All updates",
    latest: "Latest",
  },
  channels: {
    follow: "Follow",
    message: "Message",
    write: "Write",
  },
  contact: {
    emailButton: "Email me",
    copy: "Copy email",
    copied: "Copied",
    top: "Back to top",
  },
  notFound: {
    code: "404",
    title: "This page doesn’t exist, ~*or it moved.*~",
    home: "Back home",
    work: "See my work",
  },
};

export type Dictionary = typeof en;
