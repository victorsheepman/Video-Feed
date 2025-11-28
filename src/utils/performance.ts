/**
 * Performance - Utilidades para monitoreo de rendimiento
 */

import { PERFORMANCE_CONFIG } from '@/constants';

class PerformanceMonitor {
  private frameTimestamps: number[] = [];
  private lastFrameTime: number = 0;

  /**
   * Inicia el monitoreo de FPS
   */
  startMonitoring(): void {
    this.lastFrameTime = performance.now();
    this.measure();
  }

  /**
   * Mide el FPS actual
   */
  private measure(): void {
    requestAnimationFrame(() => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      
      this.frameTimestamps.push(now);
      this.lastFrameTime = now;

      // Mantener solo el último segundo de frames
      const oneSecondAgo = now - 1000;
      this.frameTimestamps = this.frameTimestamps.filter(t => t > oneSecondAgo);

      this.measure();
    });
  }

  /**
   * Obtiene el FPS actual
   */
  getCurrentFPS(): number {
    return this.frameTimestamps.length;
  }

  /**
   * Verifica si el FPS está por debajo del objetivo
   */
  isBelowTarget(): boolean {
    return this.getCurrentFPS() < PERFORMANCE_CONFIG.TARGET_FPS * 0.9; // 90% del target
  }

  /**
   * Log de métricas de rendimiento
   */
  logMetrics(): void {
    const fps = this.getCurrentFPS();
    const targetFPS = PERFORMANCE_CONFIG.TARGET_FPS;
    const emoji = fps >= targetFPS * 0.9 ? '✅' : '⚠️';
    
    console.log(`${emoji} FPS: ${fps} / ${targetFPS}`);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook de tiempo de ejecución para funciones
 */
export function measureExecutionTime<T>(
  fn: () => T,
  label: string = 'Function'
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
  
  return result;
}

/**
 * Throttle function para optimizar llamadas frecuentes
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function para optimizar llamadas frecuentes
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

