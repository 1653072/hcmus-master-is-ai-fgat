import type { NextConfig } from 'next'

/**
 * BE_URL controls where /api/* requests are proxied to.
 * Set this env var to switch between environments:
 *   Local:      BE_URL=http://localhost:5000  (default)
 *   Production: BE_URL=https://your-app.onrender.com
 *
 * In Vercel: add BE_URL as an environment variable in project settings.
 */
const beUrl = process.env.BE_URL ?? 'http://localhost:5000'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${beUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
