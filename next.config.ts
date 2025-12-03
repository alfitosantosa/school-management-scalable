import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "icons.veryicon.com", "file.pasarjaya.cloud"],
  },

  experimental: {
    // useCache: true,
  },
};

export default nextConfig;
