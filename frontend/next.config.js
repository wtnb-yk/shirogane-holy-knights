/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['i.ytimg.com', 'via.placeholder.com'], // YouTubeのサムネイル画像とプレースホルダー画像ドメインを許可
  },
}

module.exports = nextConfig