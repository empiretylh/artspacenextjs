import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.json',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMAGE_HOSTNAME || 'artspaceapi-stagging.illuminati.com.mm',
        // port: '',
        // pathname: '/images/**',
      },
    ]
  }
};

export default nextConfig;
