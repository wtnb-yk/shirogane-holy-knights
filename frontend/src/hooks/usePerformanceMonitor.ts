'use client';

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  threshold?: number; // Log only if render time exceeds this threshold (ms)
}

export const usePerformanceMonitor = ({
  componentName,
  enabled = process.env.NODE_ENV === 'development',
  threshold = 16 // 16ms = 60fps
}: UsePerformanceMonitorOptions) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
  }, [enabled]);

  // End performance measurement and log if needed
  const endMeasurement = useCallback(() => {
    if (!enabled || renderStartTime.current === 0) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    // Log slow renders
    if (renderTime > threshold) {
      console.warn(`🐌 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        renderCount: renderCount.current,
        averageRenderTime: `${(totalRenderTime.current / renderCount.current).toFixed(2)}ms`
      });
    }

    // Log performance metrics to console in development
    if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
      console.log(`📊 Performance metrics for ${componentName}:`, {
        totalRenders: renderCount.current,
        averageRenderTime: `${(totalRenderTime.current / renderCount.current).toFixed(2)}ms`,
        totalRenderTime: `${totalRenderTime.current.toFixed(2)}ms`
      });
    }

    renderStartTime.current = 0;
    return metrics;
  }, [enabled, threshold, componentName]);

  // Measure component mount time
  useEffect(() => {
    if (!enabled) return;
    
    const mountStart = performance.now();
    
    return () => {
      const mountTime = performance.now() - mountStart;
      if (mountTime > 100) { // Log mounts that take longer than 100ms
        console.warn(`🏗️ Slow mount detected in ${componentName}: ${mountTime.toFixed(2)}ms`);
      }
    };
  }, [enabled, componentName]);

  return {
    startMeasurement,
    endMeasurement,
    renderCount: renderCount.current,
    averageRenderTime: renderCount.current > 0 ? totalRenderTime.current / renderCount.current : 0
  };
};