import { isProduction } from "better-auth";
import type { NextConfig } from "next";

// Read NODE_ENV: if not set or "production" -> production mode
// If set to "development" -> development mode (disable HMR/cache)
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Image optimization with modern API
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "icons.veryicon.com" },
      { protocol: "https", hostname: "file.pasarjaya.cloud" }
    ],
    formats: ["image/avif", "image/webp"],
    // In development: shorter cache, in production: 24 hours
    minimumCacheTTL: isDevelopment ? 0 : 60 * 60 * 24,
  },

  // Optimize package imports for tree-shaking (production only)
  experimental: {
    optimizePackageImports: isDevelopment ? [
      "lucide-react",
      "recharts",
      "date-fns",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
    ] : [],
    // Disable Server Components HMR cache in development
    serverComponentsHmrCache: isDevelopment ? false : true,
  },

  // Remove console.log in production for cleaner bundles
  compiler: {
    removeConsole: !isDevelopment,
  },

  // Add caching headers for static assets
  async headers() {
    // In development: no aggressive caching
    if (!isDevelopment) {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, no-cache, must-revalidate, max-age=0",
            },
          ],
        },
      ];
    }

    // In production: aggressive caching
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Compression (production only)
  compress: !isDevelopment,

  // Power by header removal for smaller response
  poweredByHeader: false,

  // Generate ETags for caching (disable in development)
  generateEtags: !isDevelopment,

  // Development: disable file watching for HMR
  ...(!isDevelopment && {
    webpackDevMiddleware: (config: { watchOptions?: { poll?: boolean; ignored?: string[] } }) => {
      config.watchOptions = {
        ...config.watchOptions,
        poll: false,
        ignored: ["**/*"],
      };
      return config;
    },
  }),
};

export default nextConfig;
