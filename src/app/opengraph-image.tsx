import { getSite } from "@/content/settings";
import { OG_SIZE, homeOgImage } from "@/lib/og";

export const alt = `${getSite().name}: ${getSite().tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return homeOgImage();
}
