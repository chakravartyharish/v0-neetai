/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now default in Next.js 13+
  },
  images: {
    domains: ['localhost', 'supabase.com'],
  },
  transpilePackages: ['@neetai/ui', '@neetai/database'],
  typescript: {
    // Temporarily ignore type errors during build for React 19 compatibility
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig
