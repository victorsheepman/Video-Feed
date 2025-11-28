/**
 * Configuration - Constantes y configuración de la aplicación
 */

import { PrefetchConfig } from '@/types';

// Configuración de Performance
export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  FLASH_LIST_WINDOW_SIZE: 3,
  MAX_TO_RENDER_PER_BATCH: 2,
  UPDATE_CELLS_BATCH_PERIOD: 50,
  VIEWPORT_VISIBLE_THRESHOLD: 0.8, // 80% visible
  SCROLL_VELOCITY_THRESHOLD: 1000, // px/s para pausar videos
};

// Configuración de Video Player
export const VIDEO_CONFIG = {
  AUTOPLAY: true,
  MUTED_BY_DEFAULT: false,
  LOOP_VIDEOS: true,
  MAX_ACTIVE_PLAYERS: 3, // Máximo de players activos en memoria
  BUFFER_CONFIG: {
    minBufferMs: 2000,
    maxBufferMs: 5000,
    bufferForPlaybackMs: 1000,
    bufferForPlaybackAfterRebufferMs: 2000,
  },
};

// Configuración de Prefetching
export const PREFETCH_CONFIG: PrefetchConfig = {
  enabled: true,
  nextPost: true,
  nextVideo: true,
  prefetchDistance: 1, // Precargar 1 item adelante
  maxConcurrent: 2, // Máximo 2 descargas simultáneas
  onWifiOnly: false, // Permitir en datos móviles
};

// Configuración de Analytics
export const ANALYTICS_CONFIG = {
  LOG_TO_CONSOLE: true,
  BATCH_EVENTS: true,
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 5000, // ms
};

// Configuración de Reintentos
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // ms
  BACKOFF_MULTIPLIER: 2,
  MAX_DELAY: 10000, // ms
};

// Dimensiones de UI
export const UI_CONFIG = {
  POST_HEIGHT: 600,
  VIDEO_HEIGHT: 500,
  VIDEO_WIDTH: 300,
  CAROUSEL_ITEM_SPACING: 10,
};

