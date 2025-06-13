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
  experimental: {
    outputFileTracingRoot: undefined
  },
  poweredByHeader: false,
  compress: true,
  // Ensure proper production settings
  productionBrowserSourceMaps: false,
  swcMinify: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 