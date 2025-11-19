/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Experimental features for Next.js 15
  experimental: {
    // Enable Turbopack for development builds
    turbopack: {
      // Turbopack configuration can be added here
    },
  },

  // Image optimization for production
  images: {
    // Disable image optimization for Docker deployment
    unoptimized: true,

    // Add your domain(s) when deploying
    domains: [],

    // Alternative domains format for Next.js 15
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },

  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Static export configuration (if needed)
  trailingSlash: false,

  // Compression for production
  compress: true,

  // Powered by header removal for security
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification (recommended for Next.js 15)
  swcMinify: true,

  // App directory configuration
  // (Next.js 15 with App Router)

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig