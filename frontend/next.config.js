/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [
      'i.ytimg.com', 
      'via.placeholder.com',
      // CloudFront CDN domain for news images
      process.env.NEXT_PUBLIC_CDN_URL ? new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname : '',
    ].filter(Boolean), // Remove empty strings
  },
}

module.exports = nextConfig