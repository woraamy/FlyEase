import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ["images.unsplash.com", "img.clerk.com"], // Allow Unsplash images

//   },
// };
const nextConfig : NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
