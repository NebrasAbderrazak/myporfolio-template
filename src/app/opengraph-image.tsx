import { OG_SIZE, homeOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: developer, builder and founder in Gabès, Tunisia`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return homeOgImage();
}
