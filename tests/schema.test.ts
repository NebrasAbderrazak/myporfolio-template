import { describe, expect, it } from "vitest";
import { contactChannels, whatsappUrl } from "@/content/channels";
import { profileSchema, projectSchema, siteSchema } from "@/content/schema";

const profile = {
  name: "Ada",
  role: "Developer",
  portrait: "/media/portrait.jpg",
  location: { city: "Tunis", country: "Tunisia", countryCode: "tn", timeZone: "Africa/Tunis" },
  email: "ada@example.org",
};

describe("profileSchema", () => {
  it("normalises optional fields left empty in the admin panel", () => {
    const parsed = profileSchema.parse({ ...profile, whatsapp: "", status: "  ", company: { label: "", name: "", url: "" } });
    expect(parsed.whatsapp).toBeUndefined();
    expect(parsed.status).toBeUndefined();
    expect(parsed.company).toBeUndefined();
    expect(parsed.socials).toEqual([]);
    expect(parsed.location.countryCode).toBe("TN");
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
    contact: { overline: "Contact", title: "Let’s ~*talk*~", button: "Message me" },
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
      whatsapp: "+216 24 746 277",
      socials: [{ platform: "github", url: "https://github.com/ada" }],
    });
    expect(channels.map((channel) => [channel.label, channel.href, channel.handle])).toEqual([
      ["WhatsApp", "https://wa.me/21624746277", "+216 24 746 277"],
      ["Email", "mailto:ada@example.org", "ada@example.org"],
      ["GitHub", "https://github.com/ada", "github.com/ada"],
    ]);
  });

  it("builds a wa.me link from a formatted number", () => {
    expect(whatsappUrl("+1 (555) 010-9999")).toBe("https://wa.me/15550109999");
  });
});
