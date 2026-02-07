import { env } from "@/config/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
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
    ]
  }
};

export default nextConfig;
