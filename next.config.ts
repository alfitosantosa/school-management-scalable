import type { NextConfig } from "next";

// Determine environment: development or production
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // ============================================================================
  // CORE CONFIGURATION
  // ============================================================================

  // Enable standalone output for Docker deployments
  output: "standalone",

  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "icons.veryicon.com" },
      { protocol: "https", hostname: "file.pasarjaya.cloud" },
    ],
    // Use Next.js modern formats
    formats: ["image/avif", "image/webp"],

    // Image caching strategy
    minimumCacheTTL: isDev ? 0 : 86400, // 24 hours in production

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // SVG handling - allow SVG in development for faster iteration
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: isDev ? undefined : "default-src 'self'; script-src 'none'; sandbox;",

    // Production optimizations
    ...(isDev
      ? {}
      : {
          // Disable static imports optimization in development for faster builds
          // Enable in production for smaller bundles
          disableStaticImages: false,
        }),
  },

  // ============================================================================
  // PRODUCTION OPTIMIZATIONS
  // ============================================================================
  ...(isDev
    ? {}
    : {
        // Remove console.log in production for cleaner bundles
        compiler: {
          removeConsole: true,
        },

        // Optimize package imports for tree-shaking
        experimental: {
          optimizePackageImports: [
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
          ],
        },
      }),

  // ============================================================================
  // CACHING STRATEGY
  // ============================================================================
  // Aggressive caching for production, disabled for development
  async headers() {
    if (isDev) {
      // Development: no caching, always fresh
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
            { key: "Pragma", value: "no-cache" },
            { key: "Expires", value: "0" },
          ],
        },
      ];
    }

    // Production: aggressive caching
    return [
      // Static assets: 1 year immutable
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|woff|woff2|ttf|eot)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Next.js static files: 1 year immutable
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // API routes: no cache
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      // HTML pages: 1 hour
      {
        source: "/:path*.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" }],
      },
    ];
  },

  // ============================================================================
  // PERFORMANCE & SIZE
  // ============================================================================
  // Production: compress responses, Development: skip
  compress: !isDev,

  // Remove "X-Powered-By" header for security
  poweredByHeader: false,

  // Generate ETags for cache validation (disable in dev for faster builds)
  generateEtags: !isDev,

  // ============================================================================
  // DEVELOPMENT-SPECIFIC
  // ============================================================================
  ...(isDev && {
    // Enable Fast Refresh for Hot Module Replacement (HMR)
    experimental: {
      // Disable Server Components HMR cache in development for instant updates
      serverComponentsHmrCache: false,
    },
    // Reduce build time in development
    onDemandEntries: {
      maxInactiveAge: 15000, // 15 seconds
      pagesBufferLength: 5,
    },
  }),
};

export default nextConfig;
