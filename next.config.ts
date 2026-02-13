import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // ============================================================================
  // CORE
  // ============================================================================

  output: "standalone",
  reactStrictMode: true,

  // Turbopack is default in Next 16 → DO NOT manually enable

  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "icons.veryicon.com" },
      { protocol: "https", hostname: "file.pasarjaya.cloud" },
      { protocol: "https", hostname: "file.santosatechid.cloud" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: isDev ? 0 : 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: isDev ? undefined : "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ============================================================================
  // PRODUCTION OPTIMIZATION (Next 16 Stable APIs)
  // ============================================================================

  ...(isProduction && {
    compiler: {
      removeConsole: {
        exclude: ["error", "warn"],
      },
    },

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
      "@tanstack/react-query",
      "@tanstack/react-table",
    ],

    serverActions: {
      bodySizeLimit: "2mb",
    },
  }),

  // ============================================================================
  // SECURITY HEADERS
  // ============================================================================

  async headers() {
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (isDev) {
      return [
        {
          source: "/:path*",
          headers: [
            ...securityHeaders,
            {
              key: "Cache-Control",
              value: "no-store, no-cache, must-revalidate, max-age=0",
            },
          ],
        },
      ];
    }

    return [
      {
        source: "/_next/static/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // ============================================================================
  // PERFORMANCE
  // ============================================================================

  compress: true,
  poweredByHeader: false,
  generateEtags: isProduction,

  // ============================================================================
  // DEVELOPMENT ONLY
  // ============================================================================

  ...(isDev && {
    onDemandEntries: {
      maxInactiveAge: 15000,
      pagesBufferLength: 5,
    },
  }),

  // ============================================================================
  // WEBPACK (Only if absolutely needed)
  // ============================================================================

  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(xlsx|read-excel-file)$/,
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
