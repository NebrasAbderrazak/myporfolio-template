import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Picture } from "@/components/media/Picture";

function MdxImage({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;
  return (
    <span className="prose-media block">
      <Picture
        src={src}
        alt={alt ?? ""}
        sizes="(min-width: 768px) 46rem, 100vw"
        className="h-auto w-full rounded-[1.25rem] bg-paper-deep shadow-soft ring-1 ring-black/[0.05]"
      />
      {title && <span className="figcaption mt-3 block text-center">{title}</span>}
    </span>
  );
}

function MdxLink({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

const components = { img: MdxImage, a: MdxLink };

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
