

import { analytics } from '@/utils/analytics';
import { useCallback, useRef } from 'react';

interface IProps {
  videoId: string;
  postId: string;
}


export const useAnalytics = ({
  videoId,
  postId,
}: IProps) => {
  const ttffStartTime = useRef<number | null>(null);

  const logPlaybackStart = useCallback((metadata?: Record<string, any>) => {
    console.log('▶️ [Analytics] Playback Start', {
      videoId,
      postId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logPlaybackStart(videoId, postId, metadata);
  }, [videoId, postId]);

  
  const logPlaybackComplete = useCallback((metadata?: Record<string, any>) => {
    console.log('✅ [Analytics] Playback Complete', {
      videoId,
      postId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    analytics.logPlaybackComplete(videoId, postId, metadata);
  }, [videoId, postId]);

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

  const startTTFFTimer = useCallback(() => {
    ttffStartTime.current = performance.now();
    console.log('⏱️ [Analytics] TTFF Timer Started', { videoId, postId });
  }, [videoId, postId]);

    
  const endTTFFTimer = useCallback(() => {
    if (ttffStartTime.current === null) {
      console.warn('⚠️ [Analytics] TTFF Timer was not started', { videoId, postId });
      return;
    }

    const ttff = performance.now() - ttffStartTime.current;
    logTimeToFirstFrame(Math.round(ttff), {
      timerStarted: new Date(ttffStartTime.current).toISOString(),
    });

    
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



export const useAutoAnalytics = ({
  videoId,
  postId,
}: IProps) => {
  const analytics = useAnalytics({ videoId, postId });
  const hasLoggedStart = useRef(false);

 
  const onLoad = useCallback(() => {
    analytics.endTTFFTimer();
  }, [analytics]);

  
  const onProgress = useCallback((data: { currentTime: number }) => {
   
    if (!hasLoggedStart.current && data.currentTime > 0) {
      analytics.logPlaybackStart({ currentTime: data.currentTime });
      hasLoggedStart.current = true;
    }
  }, [analytics]);

  
  const onEnd = useCallback(() => {
    analytics.logPlaybackComplete();
    hasLoggedStart.current = false; 
  }, [analytics]);

  
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

