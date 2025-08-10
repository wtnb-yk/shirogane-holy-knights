/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // CloudFront CDN domain for news images
      ...(process.env.NEXT_PUBLIC_CDN_URL ? [{
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
      }] : []),
    ],
  },
}

module.exports = nextConfig