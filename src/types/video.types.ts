/**
 * Video Types - Definiciones de tipos para videos y posts
 */

export interface Video {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration: number; 
  title?: string;
  aspectRatio?: number;
}

export interface Post {
  id: string;
  videos: Video[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  caption?: string;
  likes?: number;
  comments?: number;
  timestamp: number;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  error?: string;
}

export interface VideoAnalyticsEvent {
  type: 'playback_start' | 'playback_complete' | 'playback_error' | 'time_to_first_frame';
  videoId: string;
  postId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PrefetchConfig {
  enabled: boolean;
  nextPost: boolean;
  nextVideo: boolean;
  prefetchDistance: number;
  maxConcurrent: number;
  onWifiOnly: boolean;
}

