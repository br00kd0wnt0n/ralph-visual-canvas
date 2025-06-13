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
  }
}

module.exports = nextConfig 