const RASTER = /\.(jpe?g|png|webp|avif)$/i;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/") || !RASTER.test(src)) return src;
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`;
  return encodeURI(`/_img${src.replace(RASTER, "")}-${width}.webp`);
}
