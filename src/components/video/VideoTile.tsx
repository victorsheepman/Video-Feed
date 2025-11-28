/**
 * VideoTile Component
 * 
 * Componente individual de video con player, thumbnail, estados y controles.
 * Optimizado con React.memo para evitar re-renders innecesarios.
 */

import { UI_CONFIG } from '@/constants';
import { useAutoAnalytics, useVideoPlayer } from '@/hooks';
import { Video as VideoType } from '@/types';
import { Image } from 'expo-image';
import React, { type FC, memo, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';

interface IProps {
  video: VideoType;
  postId: string;
  isActive: boolean;
  onError?: (error: string) => void;
}

/**
 * Estados del video player
 */
type PlayerStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'error';

/**
 * VideoTile - Tile individual de video con todos los estados
 * 
 * Características:
 * - Player de video con react-native-video
 * - Thumbnail mientras carga
 * - Estados: loading, ready, playing, paused, error
 * - Integración con hooks de analytics y player
 * - Optimizado con React.memo
 * 
 * @param video - Datos del video
 * @param postId - ID del post contenedor
 * @param isActive - Si este video está visible y debe reproducirse
 * @param onError - Callback para errores
 */
const VideoTile: FC<IProps> = ({
  video,
  postId,
  isActive,
  onError,
}) => {
  // Estado del player
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [showThumbnail, setShowThumbnail] = useState(true);

  // Hook de gestión del video player
  const {
    videoRef,
    playerState,
    play,
    pause,
    setIsActive: setPlayerActive,
  } = useVideoPlayer({
    videoId: video.id,
    postId,
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

  // Hook de analytics automático
  const analytics = useAutoAnalytics({
    videoId: video.id,
    postId,
  });

  /**
   * Handler cuando el video se carga correctamente
   */
  const handleLoad = useCallback(() => {
    setStatus('ready');
    analytics.onLoad();
  }, [analytics]);

  /**
   * Handler para tap en el video (play/pause manual)
   */
  const handlePress = useCallback(() => {
    if (status === 'playing') {
      pause();
      setStatus('paused');
    } else if (status === 'paused' || status === 'ready') {
      play();
      setStatus('playing');
    }
  }, [status, play, pause]);

  /**
   * Handler de progreso del video
   */
  const handleProgress = useCallback((data: any) => {
    analytics.onProgress(data);
  }, [analytics]);

  /**
   * Handler cuando el video termina
   */
  const handleEnd = useCallback(() => {
    analytics.onEnd();
    setStatus('paused');
  }, [analytics]);

  /**
   * Handler de errores del video
   */
  const handleError = useCallback((error: any) => {
    analytics.onError(error);
    setStatus('error');
  }, [analytics]);

  /**
   * Efecto para sincronizar estado activo con el player
   */
  useEffect(() => {
    setPlayerActive(isActive);
  }, [isActive, setPlayerActive]);

  /**
   * Efecto para iniciar timer de TTFF cuando empieza a cargar
   */
  useEffect(() => {
    analytics.startTTFFTimer();
  }, [analytics]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      {/* Thumbnail (se muestra mientras carga o en error) */}
      {showThumbnail && (
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
      )}

      {/* Video Player */}
      <Video
        ref={videoRef as any}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode="cover"
        paused={!playerState.isPlaying}
        repeat={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onError={handleError}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
      />

      {/* Overlay de Loading */}
      {status === 'loading' && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.statusText}>Cargando...</Text>
        </View>
      )}

      {/* Overlay de Error */}
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

      {/* Indicador de Pausa */}
      {status === 'paused' && (
        <View style={styles.pauseIndicator}>
          <Text style={styles.pauseIcon}>▶️</Text>
        </View>
      )}

      {/* Info del video (duración) */}
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

/**
 * Formatea la duración en milisegundos a formato MM:SS
 */
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

// Memoización para evitar re-renders innecesarios
// Solo re-renderiza si cambian video.id, postId o isActive
export default memo(VideoTile, (prevProps, nextProps) => {
  return (
    prevProps.video.id === nextProps.video.id &&
    prevProps.postId === nextProps.postId &&
    prevProps.isActive === nextProps.isActive
  );
});

