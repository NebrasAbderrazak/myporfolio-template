import Image, { type ImageProps } from "next/image";
import { getImageMeta } from "@/lib/images";

type Props = Omit<ImageProps, "src"> & { src: string };

// No blur placeholder: its SVG filter is expensive to paint on phones.
export function Picture({ src, alt, fill, width, height, ...rest }: Props) {
  if (fill) return <Image src={src} alt={alt} fill {...rest} />;
  const meta = getImageMeta(src);
  return <Image src={src} alt={alt} width={width ?? meta?.width ?? 1600} height={height ?? meta?.height ?? 1000} {...rest} />;
}
