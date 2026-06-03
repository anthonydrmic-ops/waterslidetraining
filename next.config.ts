import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next.js detected
  // other package-lock.json files outside the project (in the parent and home
  // folders) and warned about an ambiguous workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
