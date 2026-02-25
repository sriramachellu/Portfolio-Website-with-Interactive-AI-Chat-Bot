import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    // Allow local images to use query parameters (v=...) for cache busting
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
