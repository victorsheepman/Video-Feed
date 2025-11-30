

import { UI_CONFIG } from '@/constants';
import { useAutoAnalytics, useVideoPlayer } from '@/hooks';
import { Video as VideoType } from '@/types';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { type FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface IProps {
  video: VideoType;
  postId: string;
  isActive: boolean;
  onError?: (error: string) => void;
}


type PlayerStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'error';

const VideoTile: FC<IProps> = ({
  video,
  postId,
  isActive,
  onError,
}) => {
  
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hasStartedRef = useRef(false);
  
  const videoPlayerRef = useRef<Video>(null);


  const {
    
    playerState,
    play,
    pause,
    setIsActive: setPlayerActive,
  } = useVideoPlayer({
    videoId: video.id,
    
    autoplay: true,
    onPlaybackStart: () => {
      setStatus('playing');
      setShowThumbnail(false);
    },
    onPlaybackEnd: () => {
      setStatus('paused');
    },
    onError: (error) => {
      setStatus('error');
      if (onError) {
        onError(error);
      }
    },
  });

  
  const analytics = useAutoAnalytics({
    videoId: video.id,
    postId,
  });

  const handleLoad = useCallback(() => {
    setStatus('ready');
    analytics.onLoad();
  }, [analytics]);


  const handlePress = useCallback(() => {
    if (status === 'playing') {
      pause();
      setStatus('paused');
    } else if (status === 'paused' || status === 'ready') {
      play();
      setStatus('playing');
    }
  }, [status, play, pause]);

 
  const handleProgress = useCallback((data: any) => {
    analytics.onProgress(data);
  }, [analytics]);

  
  const handleEnd = useCallback(() => {
    analytics.onEnd();
    setStatus('paused');
  }, [analytics]);

 
  const handleError = useCallback((error: any) => {
    analytics.onError(error);
    setStatus('error');
  }, [analytics]);

  
  useEffect(() => {
    console.log(`🔄 [${video.id}] isActive cambió a: ${isActive}, playerState.isPlaying: ${playerState.isPlaying}`);
    
   
    setPlayerActive(isActive);
    
 
    if (isActive && !hasStartedRef.current) {
      hasStartedRef.current = true;
      const loadTimer = setTimeout(() => {
        setStatus('ready');
        analytics.onLoad();
      }, 300);
      
      return () => clearTimeout(loadTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    if (playerState.isPlaying && status !== 'loading' && isVideoLoaded) {
   
      const timer = setTimeout(() => {
        setShowThumbnail(false);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!isActive && !playerState.isPlaying) {
      setShowThumbnail(true);
    }
  }, [playerState.isPlaying, isActive, status, isVideoLoaded]);

  useEffect(() => {
    return () => {
      
      setIsVideoLoaded(false);
    };
  }, []);

    
  useEffect(() => {
    analytics.startTTFFTimer();
  }, [analytics]);
  
 
  useEffect(() => {
    if (playerState.isPlaying) {
      const progressInterval = setInterval(() => {
        analytics.onProgress({ currentTime: Date.now() / 1000 });
      }, 1000);
      
      return () => clearInterval(progressInterval);
    }
  }, [playerState.isPlaying, analytics]);


  useEffect(() => {
    const controlVideo = async () => {
      if (!videoPlayerRef.current || !isVideoLoaded) {
        return;
      }
      
      try {
        const status = await videoPlayerRef.current.getStatusAsync();
        
        
        if (status.isLoaded) {
          if (playerState.isPlaying && !status.isPlaying) {
            await videoPlayerRef.current.playAsync();
            console.log(`▶️ Video started: ${video.id}`);
          } else if (!playerState.isPlaying && status.isPlaying) {
            await videoPlayerRef.current.pauseAsync();
            console.log(`⏸️ Video paused: ${video.id}`);
          }
        }
      } catch (error: any) {
        const errorMsg = error?.message || String(error);
        if (!errorMsg.includes('Invalid view') && !errorMsg.includes('null')) {
          console.error(`Error controlling video ${video.id}:`, error);
        }
      }
    };
    
    
    const timer = setTimeout(controlVideo, 50);
    return () => clearTimeout(timer);
  }, [playerState.isPlaying, isVideoLoaded, video.id]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      
      <Video
        ref={videoPlayerRef}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={false}
        onLoad={(status) => {
          console.log(`📹 Video loaded: ${video.id}`);
          setIsVideoLoaded(true);
          handleLoad();
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            handleProgress({ currentTime: (status.positionMillis || 0) / 1000 });
            
            if (status.didJustFinish) {
              handleEnd();
            }
          }
        }}
        onError={(error) => {
          console.error(`❌ Video error ${video.id}:`, error);
          setIsVideoLoaded(false);
          handleError(error);
        }}
        posterSource={{ uri: video.thumbnailUrl }}
        usePoster={true}
      />

      
      {showThumbnail && (
        <View style={styles.loadingOverlay}>
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={200}
          />
        </View>
      )}

      
      {status === 'loading' && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.statusText}>Cargando...</Text>
        </View>
      )}

      
      {status === 'error' && (
        <View style={[styles.overlay, styles.errorOverlay]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Error al cargar video</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setStatus('loading')}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      
      {status === 'paused' && (
        <View style={styles.pauseIndicator}>
          <Text style={styles.pauseIcon}>▶️</Text>
        </View>
      )}

      
      {video.duration && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {formatDuration(video.duration)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

  
const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    width: UI_CONFIG.VIDEO_WIDTH,
    height: UI_CONFIG.VIDEO_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: UI_CONFIG.CAROUSEL_ITEM_SPACING,
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  pauseIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pauseIcon: {
    fontSize: 64,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});


export default memo(VideoTile, (prevProps, nextProps) => {
  return (
    prevProps.video.id === nextProps.video.id &&
    prevProps.postId === nextProps.postId &&
    prevProps.isActive === nextProps.isActive
  );
});

