import { hostname } from 'zod';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[ {
      protocol: "https",
      hostname: "img.clerk.com"
    },]
  }
  /* config options here */
};

export default nextConfig;
