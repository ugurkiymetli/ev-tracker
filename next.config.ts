import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "192.168.1.165",
    "192.168.1.*",
    "192.168.*",
    "10.*",
    "172.16.*",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "192.168.*:*",
        "10.*:*",
        "172.16.*:*",
        "*:3000",
      ],
    },
  },
};

export default nextConfig;
