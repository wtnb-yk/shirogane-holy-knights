/**
 * Performance optimization component for critical resources
 */
export function PerformanceOptimizations() {
  return (
    <>
      {/* Resource hints for external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i.ytimg.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </>
  );
}

