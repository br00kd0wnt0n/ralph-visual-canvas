/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  poweredByHeader: false,
  compress: true,
  // Ensure proper production settings
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable webpack caching during development
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig 