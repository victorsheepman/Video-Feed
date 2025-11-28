/**
 * Analytics - Sistema de logging de eventos
 */

import { ANALYTICS_CONFIG } from '@/constants';
import { VideoAnalyticsEvent } from '@/types';

class AnalyticsService {
  private eventQueue: VideoAnalyticsEvent[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Registra un evento de analytics
   */
  logEvent(event: Omit<VideoAnalyticsEvent, 'timestamp'>): void {
    const fullEvent: VideoAnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    if (ANALYTICS_CONFIG.LOG_TO_CONSOLE) {
      this.logToConsole(fullEvent);
    }

    if (ANALYTICS_CONFIG.BATCH_EVENTS) {
      this.queueEvent(fullEvent);
    }
  }

  /**
   * Log de evento de inicio de reproducción
   */
  logPlaybackStart(videoId: string, postId: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'playback_start',
      videoId,
      postId,
      metadata,
    });
  }

  /**
   * Log de evento de reproducción completada
   */
  logPlaybackComplete(videoId: string, postId: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'playback_complete',
      videoId,
      postId,
      metadata,
    });
  }

  /**
   * Log de error de reproducción
   */
  logPlaybackError(videoId: string, postId: string, error: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'playback_error',
      videoId,
      postId,
      metadata: { ...metadata, error },
    });
  }

  /**
   * Log de tiempo hasta el primer frame
   */
  logTimeToFirstFrame(videoId: string, postId: string, ttff: number, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'time_to_first_frame',
      videoId,
      postId,
      metadata: { ...metadata, ttff },
    });
  }

  /**
   * Log formateado en consola
   */
  private logToConsole(event: VideoAnalyticsEvent): void {
    const emoji = this.getEmojiForEventType(event.type);
    const timeStr = new Date(event.timestamp).toLocaleTimeString();
    
    console.log(
      `${emoji} [${timeStr}] ${event.type}`,
      `\n  Video: ${event.videoId}`,
      `\n  Post: ${event.postId}`,
      event.metadata ? `\n  Metadata: ${JSON.stringify(event.metadata)}` : ''
    );
  }

  /**
   * Añade evento a la cola
   */
  private queueEvent(event: VideoAnalyticsEvent): void {
    this.eventQueue.push(event);

    if (this.eventQueue.length >= ANALYTICS_CONFIG.BATCH_SIZE) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, ANALYTICS_CONFIG.FLUSH_INTERVAL);
    }
  }

  /**
   * Envía los eventos en batch (en una app real, esto enviaría a un servidor)
   */
  private flush(): void {
    if (this.eventQueue.length === 0) return;

    // En producción, aquí enviarías los eventos a tu backend
    console.log(`📊 Flushing ${this.eventQueue.length} analytics events`);
    
    this.eventQueue = [];
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Obtiene emoji para el tipo de evento
   */
  private getEmojiForEventType(type: VideoAnalyticsEvent['type']): string {
    switch (type) {
      case 'playback_start':
        return '▶️';
      case 'playback_complete':
        return '✅';
      case 'playback_error':
        return '❌';
      case 'time_to_first_frame':
        return '⏱️';
      default:
        return '📊';
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

