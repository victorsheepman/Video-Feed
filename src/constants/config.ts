
import { PrefetchConfig } from '@/types';

export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  FLASH_LIST_WINDOW_SIZE: 3,
  MAX_TO_RENDER_PER_BATCH: 2,
  UPDATE_CELLS_BATCH_PERIOD: 50,
  VIEWPORT_VISIBLE_THRESHOLD: 0.8, 
  SCROLL_VELOCITY_THRESHOLD: 1000
};


export const VIDEO_CONFIG = {
  AUTOPLAY: true,
  MUTED_BY_DEFAULT: false,
  LOOP_VIDEOS: true,
  MAX_ACTIVE_PLAYERS: 3, 
  BUFFER_CONFIG: {
    minBufferMs: 2000,
    maxBufferMs: 5000,
    bufferForPlaybackMs: 1000,
    bufferForPlaybackAfterRebufferMs: 2000
  },
};

export const PREFETCH_CONFIG: PrefetchConfig = {
  enabled: true,
  nextPost: true,
  nextVideo: true,
  prefetchDistance: 1, 
  maxConcurrent: 2, 
  onWifiOnly: false
};

export const ANALYTICS_CONFIG = {
  LOG_TO_CONSOLE: true,
  BATCH_EVENTS: true,
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 5000
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, 
  BACKOFF_MULTIPLIER: 2,
  MAX_DELAY: 10000, 
};

export const UI_CONFIG = {
  POST_HEIGHT: 600,
  VIDEO_HEIGHT: 500,
  VIDEO_WIDTH: 300,
  CAROUSEL_ITEM_SPACING: 10,
};

