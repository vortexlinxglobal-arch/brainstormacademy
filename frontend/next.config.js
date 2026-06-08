const path = require("path");

const nextConfig = {
  // Only treat files using the App Router `page.*` conventions as pages.
  // This prevents conflicts with temporary `pages/*.tsx` files added during debugging.
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/:path*`,
        },
      ],
      afterFiles: [],
    };
  },
};

module.exports = nextConfig;
