

import { VideoPlayerState } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';


type VideoPlayerRef = {
  seek: (time: number) => void;
  presentFullscreenPlayer?: () => void;
  dismissFullscreenPlayer?: () => void;
}

const activeVideoRefs = new Map<string, VideoPlayerRef | null>();

 
let currentActiveVideoId: string | null = null;

interface IProps {
  videoId: string;
  autoplay?: boolean;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onError?: (error: string) => void;
}

const initialState: VideoPlayerState = {
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
  duration: 0,
};
export const useVideoPlayer = ({
  videoId,
  autoplay = false,
  onPlaybackStart,
  onPlaybackEnd,
  onError,
}: IProps) => {

  const videoRef = useRef<VideoPlayerRef>(null);


    const [playerState, setPlayerState] = useState<VideoPlayerState>(initialState);

  const [isActive, setIsActive] = useState(false);

 
  const pauseOtherVideos = useCallback(() => {
    if (currentActiveVideoId && currentActiveVideoId !== videoId) {
      const otherVideoRef = activeVideoRefs.get(currentActiveVideoId);
      if (otherVideoRef) {
        
        console.log(`⏸️ Pausing other video: ${currentActiveVideoId}`);
      }
    }
  }, [videoId]);

  
  const play = useCallback(async () => {
    try {
      if (!videoRef.current) {
        console.warn(`⚠️ Video ref not available for ${videoId}`);
        return;
      }

      
      pauseOtherVideos();

      currentActiveVideoId = videoId;

      setPlayerState(prev => ({ ...prev, isPlaying: true }));

      
      if (onPlaybackStart) {
        onPlaybackStart();
      }

      console.log(`▶️ Playing video: ${videoId}`);
    } catch (error) {
      console.error(`❌ Error playing video ${videoId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPlayerState(prev => ({ ...prev, error: errorMessage }));
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [videoId, pauseOtherVideos, onPlaybackStart, onError]);

  
  const pause = useCallback(async () => {
    try {
      if (!videoRef.current) {
        return;
      }

      setPlayerState(prev => ({ ...prev, isPlaying: false }));

      
      if (currentActiveVideoId === videoId) {
        currentActiveVideoId = null;
      }

      console.log(`⏸️ Pausing video: ${videoId}`);
    } catch (error) {
      console.error(`❌ Error pausing video ${videoId}:`, error);
    }
  }, [videoId]);

  
  const seek = useCallback((time: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.seek(time);
    setPlayerState(prev => ({ ...prev, currentTime: time }));
    console.log(`⏭️ Seeking video ${videoId} to ${time}s`);
  }, [videoId]);

  
  useEffect(() => {
    if (videoRef.current) {
      activeVideoRefs.set(videoId, videoRef.current);
      console.log(`📹 Video ref registered: ${videoId}`);
    }

    
    return () => {
      activeVideoRefs.delete(videoId);
      
      if (currentActiveVideoId === videoId) {
        currentActiveVideoId = null;
      }
      
      console.log(`🗑️ Video ref unregistered: ${videoId}`);
    };
  }, [videoId]);

  
  useEffect(() => {
    if (isActive && autoplay) {
      play();
    } else if (!isActive && playerState.isPlaying) {
      pause();
    }
  }, [isActive, autoplay, play, pause, playerState.isPlaying]);

  
  useEffect(() => {
    if (playerState.currentTime > 0 && 
        playerState.duration > 0 && 
        playerState.currentTime >= playerState.duration - 0.5) {
      console.log(`✅ Video completed: ${videoId}`);
      
      if (onPlaybackEnd) {
        onPlaybackEnd();
      }
    }
  }, [playerState.currentTime, playerState.duration, videoId, onPlaybackEnd]);

  return {
    videoRef,
    playerState,
    isActive,
    play,
    pause,
    seek,
    setIsActive,
  };
};





export const pauseAllVideos = (): void => {
  console.log('⏸️ Pausing all active videos');
  activeVideoRefs.forEach((ref, videoId) => {
    console.log(`⏸️ Pausing video: ${videoId}`);
  });
  currentActiveVideoId = null;
};


export const getActiveVideoCount = (): number => {
  return activeVideoRefs.size;
};

