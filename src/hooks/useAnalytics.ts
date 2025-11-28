/**
 * useAnalytics Hook
 * 
 * Hook para logging de eventos de analytics relacionados con reproducción de video.
 * Proporciona funciones optimizadas para registrar eventos clave.
 */

import { analytics } from '@/utils/analytics';
import { useCallback, useRef } from 'react';

interface UseAnalyticsProps {
  videoId: string;
  postId: string;
}

interface UseAnalyticsReturn {
  logPlaybackStart: (metadata?: Record<string, any>) => void;
  logPlaybackComplete: (metadata?: Record<string, any>) => void;
  logPlaybackError: (error: string, metadata?: Record<string, any>) => void;
  logTimeToFirstFrame: (ttff: number, metadata?: Record<string, any>) => void;
  startTTFFTimer: () => void;
  endTTFFTimer: () => void;
}

/**
 * Hook para gestionar analytics de video
 * 
 * Proporciona funciones memoizadas para loggear eventos de video sin causar
 * re-renders innecesarios. Incluye un timer automático para Time-To-First-Frame.
 * 
 * Eventos soportados:
 * - playback_start: Cuando el video comienza a reproducirse
 * - playback_complete: Cuando el video termina
 * - playback_error: Cuando ocurre un error
 * - time_to_first_frame: Medición del TTFF
 * 
 * @param videoId - ID único del video
 * @param postId - ID del post contenedor
 * 
 * @example
 * ```tsx
 * const { logPlaybackStart, startTTFFTimer, endTTFFTimer } = useAnalytics({
 *   videoId: 'video-123',
 *   postId: 'post-456'
 * });
 * 
 * // Al cargar el video
 * startTTFFTimer();
 * 
 * // Cuando empieza a reproducirse
 * logPlaybackStart({ source: 'autoplay' });
 * 
 * // Cuando se renderiza el primer frame
 * endTTFFTimer();
 * ```
 */
export const useAnalytics = ({
  videoId,
  postId,
}: UseAnalyticsProps): UseAnalyticsReturn => {
  // Ref para almacenar el timestamp de inicio del TTFF
  const ttffStartTime = useRef<number | null>(null);

  /**
   * Registra el evento de inicio de reproducción
   */
  const logPlaybackStart = useCallback((metadata?: Record<string, any>) => {
    console.log('▶️ [Analytics] Playback Start', {
      videoId,
      postId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logPlaybackStart(videoId, postId, metadata);
  }, [videoId, postId]);

  /**
   * Registra el evento de reproducción completada
   */
  const logPlaybackComplete = useCallback((metadata?: Record<string, any>) => {
    console.log('✅ [Analytics] Playback Complete', {
      videoId,
      postId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logPlaybackComplete(videoId, postId, metadata);
  }, [videoId, postId]);

  /**
   * Registra un error de reproducción
   */
  const logPlaybackError = useCallback((
    error: string,
    metadata?: Record<string, any>
  ) => {
    console.error('❌ [Analytics] Playback Error', {
      videoId,
      postId,
      error,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logPlaybackError(videoId, postId, error, metadata);
  }, [videoId, postId]);

  /**
   * Registra el Time-To-First-Frame
   */
  const logTimeToFirstFrame = useCallback((
    ttff: number,
    metadata?: Record<string, any>
  ) => {
    console.log('⏱️ [Analytics] Time To First Frame', {
      videoId,
      postId,
      ttff: `${ttff}ms`,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logTimeToFirstFrame(videoId, postId, ttff, metadata);
  }, [videoId, postId]);

  /**
   * Inicia el timer para medir TTFF
   * Llamar cuando se comienza a cargar el video
   */
  const startTTFFTimer = useCallback(() => {
    ttffStartTime.current = performance.now();
    console.log('⏱️ [Analytics] TTFF Timer Started', { videoId, postId });
  }, [videoId, postId]);

  /**
   * Finaliza el timer y registra el TTFF automáticamente
   * Llamar cuando se renderiza el primer frame del video
   */
  const endTTFFTimer = useCallback(() => {
    if (ttffStartTime.current === null) {
      console.warn('⚠️ [Analytics] TTFF Timer was not started', { videoId, postId });
      return;
    }

    const ttff = performance.now() - ttffStartTime.current;
    logTimeToFirstFrame(Math.round(ttff), {
      timerStarted: new Date(ttffStartTime.current).toISOString(),
    });

    // Reset timer
    ttffStartTime.current = null;
  }, [videoId, postId, logTimeToFirstFrame]);

  return {
    logPlaybackStart,
    logPlaybackComplete,
    logPlaybackError,
    logTimeToFirstFrame,
    startTTFFTimer,
    endTTFFTimer,
  };
};

/**
 * Hook simplificado para analytics que auto-gestiona eventos comunes
 * 
 * @example
 * ```tsx
 * const analytics = useAutoAnalytics({ videoId, postId });
 * 
 * // El hook automáticamente registra eventos basándose en el estado
 * <Video
 *   onLoad={analytics.onLoad}
 *   onProgress={analytics.onProgress}
 *   onEnd={analytics.onEnd}
 *   onError={analytics.onError}
 * />
 * ```
 */
export const useAutoAnalytics = ({
  videoId,
  postId,
}: UseAnalyticsProps) => {
  const analytics = useAnalytics({ videoId, postId });
  const hasLoggedStart = useRef(false);

  /**
   * Handler para cuando el video se carga
   */
  const onLoad = useCallback(() => {
    analytics.endTTFFTimer();
  }, [analytics]);

  /**
   * Handler para progreso del video
   */
  const onProgress = useCallback((data: { currentTime: number }) => {
    // Log playback start solo una vez
    if (!hasLoggedStart.current && data.currentTime > 0) {
      analytics.logPlaybackStart({ currentTime: data.currentTime });
      hasLoggedStart.current = true;
    }
  }, [analytics]);

  /**
   * Handler para cuando el video termina
   */
  const onEnd = useCallback(() => {
    analytics.logPlaybackComplete();
    hasLoggedStart.current = false; // Reset para si se reproduce de nuevo
  }, [analytics]);

  /**
   * Handler para errores
   */
  const onError = useCallback((error: any) => {
    const errorMessage = error?.error?.message || error?.toString() || 'Unknown error';
    analytics.logPlaybackError(errorMessage, { error });
  }, [analytics]);

  return {
    ...analytics,
    onLoad,
    onProgress,
    onEnd,
    onError,
  };
};

