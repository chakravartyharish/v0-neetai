/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Completely ignore TypeScript during build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable typed routes
  typedRoutes: false,
};

export default nextConfig;
