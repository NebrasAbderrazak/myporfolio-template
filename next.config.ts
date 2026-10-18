import type { NextConfig } from "next";
import { DEVICE_SIZES, IMAGE_SIZES } from "./image.config.mjs";

const nextConfig: NextConfig = {
  output: "export",
  agentRules: false,
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
    qualities: [75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
