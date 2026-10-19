import { describe, expect, it } from "vitest";
import { contactChannels, whatsappUrl } from "@/content/channels";
import { nowSchema, profileSchema, projectSchema, siteSchema } from "@/content/schema";

const profile = {
  name: "Ada",
  role: "Developer",
  portrait: "/media/portrait.jpg",
  location: { city: "Lisbon", country: "Portugal", countryCode: "pt", timeZone: "Europe/Lisbon" },
  email: "ada@example.org",
};

describe("profileSchema", () => {
  it("normalises optional fields left empty in the admin panel", () => {
    const parsed = profileSchema.parse({ ...profile, whatsapp: "", status: "  ", company: { label: "", name: "", url: "" } });
    expect(parsed.whatsapp).toBeUndefined();
    expect(parsed.status).toBeUndefined();
    expect(parsed.company).toBeUndefined();
    expect(parsed.socials).toEqual([]);
    expect(parsed.location.countryCode).toBe("PT");
  });

  it("rejects an unknown time zone", () => {
    const result = profileSchema.safeParse({ ...profile, location: { ...profile.location, timeZone: "Mars/Olympus" } });
    expect(result.success).toBe(false);
  });

  it("rejects a social link that is not a full URL", () => {
    const result = profileSchema.safeParse({ ...profile, socials: [{ platform: "github", url: "github.com/ada" }] });
    expect(result.success).toBe(false);
  });
});

describe("siteSchema", () => {
  const site = {
    name: "Ada",
    url: "https://ada.dev/",
    tagline: "Developer",
    description: "Hi.",
    contact: { title: "Let’s ~*talk*~", button: "Message me" },
    footer: {},
  };

  it("strips the trailing slash from the site URL and parses headings", () => {
    const parsed = siteSchema.parse(site);
    expect(parsed.url).toBe("https://ada.dev");
    expect(parsed.contact.title[0][1]).toEqual({ text: "talk", tone: "mute", italic: true });
  });

  it("reports an unclosed emphasis marker", () => {
    const result = siteSchema.safeParse({ ...site, contact: { ...site.contact, title: "Let’s *talk" } });
    expect(result.success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("accepts YAML dates and fills in defaults", () => {
    const parsed = projectSchema.parse({ title: "Shop", summary: "A shop.", date: new Date("2026-09-01"), mockup: "" });
    expect(parsed).toMatchObject({ date: "2026-09-01", mockup: "laptop", tags: [], featured: false, draft: false });
  });

  it("rejects a malformed date", () => {
    expect(projectSchema.safeParse({ title: "Shop", summary: "A shop.", date: "Sept 2026" }).success).toBe(false);
  });
});

describe("contactChannels", () => {
  it("lists direct channels before social profiles", () => {
    const channels = contactChannels({
      email: "ada@example.org",
      whatsapp: "+44 7700 900123",
      socials: [{ platform: "github", url: "https://github.com/ada" }],
    });
    expect(channels.map((channel) => [channel.label, channel.href, channel.handle])).toEqual([
      ["WhatsApp", "https://wa.me/447700900123", "+44 7700 900123"],
      ["Email", "mailto:ada@example.org", "ada@example.org"],
      ["GitHub", "https://github.com/ada", "github.com/ada"],
    ]);
  });

  it("builds a wa.me link from a formatted number", () => {
    expect(whatsappUrl("+1 (555) 010-9999")).toBe("https://wa.me/15550109999");
  });
});

describe("nowSchema", () => {
  const base = { title: "Now", items: [] };

  it("allows an empty draft", () => {
    expect(nowSchema.parse({ ...base, draft: true }).items).toEqual([]);
  });

  it("asks for 3 to 5 lines before it is published", () => {
    expect(nowSchema.safeParse({ ...base, draft: false }).success).toBe(false);
    const items = ["Building", "Learning", "Thinking about"].map((label) => ({ label, text: "Something" }));
    expect(nowSchema.safeParse({ ...base, draft: false, items }).success).toBe(true);
  });
});
