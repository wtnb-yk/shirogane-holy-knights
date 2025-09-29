// Conditionally load bundle analyzer only when needed
let withBundleAnalyzer = (config) => config;
try {
  if (process.env.ANALYZE === 'true') {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  }
} catch (error) {
  console.warn('Bundle analyzer not available. Install @next/bundle-analyzer to use bundle analysis.');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-tooltip'
    ],
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          // Separate UI components chunk
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            priority: 20,
            chunks: 'all',
          },
          // Separate feature chunks
          features: {
            test: /[\\/]src[\\/]features[\\/]/,
            name: 'features',
            priority: 15,
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
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
    // Image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 85, 90, 95], // 使用可能な品質設定を明示的に定義
  },

  // Additional performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // CSP設定
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.youtube.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.youtube.com https://i.ytimg.com" + 
        (process.env.NEXT_PUBLIC_API_URL ? ` ${process.env.NEXT_PUBLIC_API_URL}` : '') +
        (isDevelopment ? " http://localhost:* ws://localhost:*" : ''),
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    const csp = cspDirectives.join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // APIプロキシ設定（開発環境用）
  async rewrites() {
    // フロントエンドはDocker内で実行されているため、localstack:4566でアクセス
    return [
      {
        source: '/api/:path*',
        destination: 'http://localstack:4566/restapis/shirogane-api/dev/_user_request_/:path*',
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
