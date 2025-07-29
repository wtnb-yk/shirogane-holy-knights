/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['i.ytimg.com'], // YouTubeのサムネイル画像ドメインを許可
  },
}

module.exports = nextConfig