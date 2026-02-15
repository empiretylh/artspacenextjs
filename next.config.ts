import { env } from "@/config/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.json',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: env.IMAGE_HOSTNAME,
        // port: '',
        // pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        // port: '',
        // pathname: '/images/**',
      },
    ]
  }
};

export default nextConfig;
