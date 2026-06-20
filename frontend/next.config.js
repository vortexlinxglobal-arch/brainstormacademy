const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "avatars.dicebear.com",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: "/v1/:path*",
          destination: `${backendUrl.replace(/\/$/, "")}/v1/:path*`,
        },
      ],
      afterFiles: [],
    };
  },
};

module.exports = nextConfig;
