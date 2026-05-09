/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@/*': './*',
      },
    },
  },
}

module.exports = nextConfig
