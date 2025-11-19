import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "5000",
  },
  {
    protocol: "https",
    hostname: "**",
  },
  {
    protocol: "http",
    hostname: "**",
  }
];

if (process.env.NEXT_PUBLIC_MEDIA_HOST) {
  remotePatterns.push({
    protocol: (process.env.NEXT_PUBLIC_MEDIA_PROTOCOL as RemotePattern["protocol"]) || "https",
    hostname: process.env.NEXT_PUBLIC_MEDIA_HOST,
  });
}

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns,
    unoptimized: process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === "true",
  },
};

export default nextConfig;
