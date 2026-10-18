import type { ComponentProps } from "react";
import { getImageMeta } from "@/lib/images";
import { placeImage, type Framing } from "@/lib/framing";
import { Picture } from "./Picture";

type Props = Omit<ComponentProps<typeof Picture>, "fill" | "width" | "height" | "style"> & {
  framing: Framing;
};

const percent = (fraction: number) => `${(fraction * 100).toFixed(3)}%`;

/**
 * Fills a square frame with an image cropped around a focus point.
 * The parent must be positioned and clip its overflow.
 */
export function FramedImage({ src, framing, className, ...rest }: Props) {
  const meta = getImageMeta(src);
  if (!meta) return <Picture src={src} fill className={className ?? "object-cover"} {...rest} />;

  const { left, top, width, height } = placeImage(meta, framing);
  return (
    <span className="absolute" style={{ left: percent(left), top: percent(top), width: percent(width), height: percent(height) }}>
      <Picture src={src} fill className={className ?? "object-cover"} {...rest} />
    </span>
  );
}
