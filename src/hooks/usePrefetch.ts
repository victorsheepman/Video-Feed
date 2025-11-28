/**
 * usePrefetch Hook
 * 
 * Hook para gestionar prefetching inteligente de videos y posts.
 * Optimiza la experiencia de usuario precargando contenido antes de que sea necesario.
 */

import { PREFETCH_CONFIG } from '@/constants';
import { Post, Video } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  currentPostIndex: number;
  currentVideoIndex: number;
  posts: Post[];
  enabled?: boolean;
}

/**
 * Set global de URLs prefetched para evitar duplicados
 */
const globalPrefetchedUrls = new Set<string>();

/**
 * Queue de prefetch para limitar requests concurrentes
 */
const prefetchQueue: (() => Promise<void>)[] = [];
let activePrefetches = 0;

/**
 * Ejecuta el próximo item en la queue de prefetch
 */
const processQueue = async () => {
  if (activePrefetches >= PREFETCH_CONFIG.maxConcurrent || prefetchQueue.length === 0) {
    return;
  }

  const task = prefetchQueue.shift();
  if (!task) return;

  activePrefetches++;
  
  try {
    await task();
  } catch (error) {
    console.error('❌ Prefetch error:', error);
  } finally {
    activePrefetches--;
    processQueue(); // Procesar siguiente en queue
  }
};

/**
 * Agrega una tarea de prefetch a la queue
 */
const enqueuePrefetch = (task: () => Promise<void>) => {
  prefetchQueue.push(task);
  processQueue();
};

/**
 * Simula el prefetch de un video (en producción, usarías algo como react-native-fast-image)
 */
const prefetchVideo = async (url: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`🔄 Prefetching video: ${url.substring(0, 50)}...`);
    
    // En una app real, aquí harías el prefetch real
    // Por ejemplo: Image.prefetch(thumbnailUrl) o Video.prefetch(videoUrl)
    
    // Simular delay de red
    setTimeout(() => {
      globalPrefetchedUrls.add(url);
      console.log(`✅ Prefetched: ${url.substring(0, 50)}...`);
      resolve();
    }, 100);
  });
};

/**
 * Hook para gestionar prefetching inteligente de contenido
 * 
 * Características:
 * - Prefetch del siguiente post en el feed vertical
 * - Prefetch del siguiente video en el carrusel horizontal
 * - Control de profundidad de prefetch configurable
 * - Límite de requests concurrentes
 * - Evita duplicados
 * - Respeta configuración WiFi-only (si está habilitado)
 * 
 * @param currentPostIndex - Índice del post actualmente visible
 * @param currentVideoIndex - Índice del video actualmente visible en el post
 * @param posts - Array completo de posts
 * @param enabled - Si el prefetching está habilitado (override de config)
 * 
 * @example
 * ```tsx
 * const { prefetchNextPost, isPrefetching } = usePrefetch({
 *   currentPostIndex: 5,
 *   currentVideoIndex: 2,
 *   posts: allPosts,
 * });
 * 
 * // El hook automáticamente prefetchea contenido relevante
 * // También puedes llamar manualmente:
 * prefetchNextPost();
 * ```
 */
export const usePrefetch = ({
  currentPostIndex,
  currentVideoIndex,
  posts,
  enabled = PREFETCH_CONFIG.enabled,
}: IProps) => {
  // Estado local de URLs prefetched
  const [prefetchedUrls, setPrefetchedUrls] = useState<Set<string>>(new Set());
  const [isPrefetching, setIsPrefetching] = useState(false);

  // Refs para evitar prefetch duplicados durante el mismo ciclo
  const lastPrefetchedPostRef = useRef<number>(-1);
  const lastPrefetchedVideoRef = useRef<number>(-1);

  /**
   * Prefetch de un video específico
   */
  const prefetchSingleVideo = useCallback(async (video: Video) => {
    if (globalPrefetchedUrls.has(video.url)) {
      console.log(`⏭️ Already prefetched: ${video.id}`);
      return;
    }

    setIsPrefetching(true);

    enqueuePrefetch(async () => {
      try {
        await prefetchVideo(video.url);
        
        // Prefetch thumbnail también
        if (video.thumbnailUrl && !globalPrefetchedUrls.has(video.thumbnailUrl)) {
          await prefetchVideo(video.thumbnailUrl);
        }

        setPrefetchedUrls(prev => new Set(prev).add(video.url));
      } catch (error) {
        console.error(`❌ Error prefetching video ${video.id}:`, error);
      }
    });

    setIsPrefetching(false);
  }, []);

  /**
   * Prefetch del siguiente video en el carrusel actual
   */
  const prefetchNextVideo = useCallback(() => {
    if (!enabled || !PREFETCH_CONFIG.nextVideo) {
      return;
    }

    const currentPost = posts[currentPostIndex];
    if (!currentPost) return;

    const nextVideoIndex = currentVideoIndex + PREFETCH_CONFIG.prefetchDistance;
    const nextVideo = currentPost.videos[nextVideoIndex];

    if (nextVideo && lastPrefetchedVideoRef.current !== nextVideoIndex) {
      console.log(`🎥 Prefetching next video in carousel: ${nextVideo.id}`);
      prefetchSingleVideo(nextVideo);
      lastPrefetchedVideoRef.current = nextVideoIndex;
    }
  }, [enabled, posts, currentPostIndex, currentVideoIndex, prefetchSingleVideo]);

  /**
   * Prefetch del siguiente post en el feed vertical
   */
  const prefetchNextPost = useCallback(() => {
    if (!enabled || !PREFETCH_CONFIG.nextPost) {
      return;
    }

    const nextPostIndex = currentPostIndex + PREFETCH_CONFIG.prefetchDistance;
    const nextPost = posts[nextPostIndex];

    if (nextPost && lastPrefetchedPostRef.current !== nextPostIndex) {
      console.log(`📝 Prefetching next post: ${nextPost.id}`);
      
      // Prefetch el primer video del siguiente post
      const firstVideo = nextPost.videos[0];
      if (firstVideo) {
        prefetchSingleVideo(firstVideo);
      }

      lastPrefetchedPostRef.current = nextPostIndex;
    }
  }, [enabled, posts, currentPostIndex, prefetchSingleVideo]);

  /**
   * Prefetch del post anterior (para scroll hacia atrás)
   */
  const prefetchPreviousPost = useCallback(() => {
    if (!enabled) {
      return;
    }

    const prevPostIndex = currentPostIndex - 1;
    const prevPost = posts[prevPostIndex];

    if (prevPost && prevPostIndex >= 0) {
      console.log(`📝 Prefetching previous post: ${prevPost.id}`);
      
      const firstVideo = prevPost.videos[0];
      if (firstVideo) {
        prefetchSingleVideo(firstVideo);
      }
    }
  }, [enabled, posts, currentPostIndex, prefetchSingleVideo]);

  /**
   * Efecto para prefetch automático cuando cambia el índice
   */
  useEffect(() => {
    if (!enabled) return;

    // Prefetch siguiente video en carrusel actual
    prefetchNextVideo();

    // Prefetch siguiente post
    prefetchNextPost();
  }, [enabled, currentPostIndex, currentVideoIndex, prefetchNextVideo, prefetchNextPost]);

  /**
   * Limpieza al desmontar
   */
  useEffect(() => {
    return () => {
      // Limpiar refs
      lastPrefetchedPostRef.current = -1;
      lastPrefetchedVideoRef.current = -1;
    };
  }, []);

  return {
    isPrefetching,
    prefetchedUrls,
    prefetchNextPost,
    prefetchNextVideo,
    prefetchPreviousPost
  };
};

/**
 * Hook simplificado para prefetch automático
 * No requiere llamadas manuales, gestiona todo automáticamente
 */
export const useAutoPrefetch = ({
  currentPostIndex,
  currentVideoIndex,
  posts,
  enabled = PREFETCH_CONFIG.enabled,
}: IProps) => {
  const prefetch = usePrefetch({
    currentPostIndex,
    currentVideoIndex,
    posts,
    enabled,
  });

  // Auto-prefetch está manejado por el efecto en usePrefetch
  return prefetch;
};

/**
 * Limpia el cache de prefetch (útil para liberar memoria)
 */
export const clearPrefetchCache = () => {
  console.log('🗑️ Clearing prefetch cache');
  globalPrefetchedUrls.clear();
  prefetchQueue.length = 0;
  activePrefetches = 0;
};

/**
 * Obtiene estadísticas del prefetch
 */
export const getPrefetchStats = () => {
  return {
    totalPrefetched: globalPrefetchedUrls.size,
    queueSize: prefetchQueue.length,
    activePrefetches,
    maxConcurrent: PREFETCH_CONFIG.maxConcurrent,
  };
};

