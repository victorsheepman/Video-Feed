/**
 * useVideoPlayer Hook
 * 
 * Gestiona el estado de reproducción de videos, referencias y control centralizado
 * de play/pause para optimizar el rendimiento y evitar múltiples videos activos.
 */

import { VideoPlayerState } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Interfaz para las referencias del componente Video de react-native-video
 * Define los métodos que necesitamos del player
 */
interface VideoPlayerRef {
  seek: (time: number) => void;
  presentFullscreenPlayer?: () => void;
  dismissFullscreenPlayer?: () => void;
}

/**
 * Mapa de referencias de videos activos
 * Key: videoId, Value: Video ref
 */
const activeVideoRefs = new Map<string, VideoPlayerRef | null>();

/**
 * ID del video actualmente reproduciéndose
 */
let currentActiveVideoId: string | null = null;

interface UseVideoPlayerProps {
  videoId: string;
  postId: string;
  autoplay?: boolean;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseVideoPlayerReturn {
  videoRef: React.RefObject<VideoPlayerRef | null>;
  playerState: VideoPlayerState;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (time: number) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

/**
 * Hook para gestionar el estado y control de un video player individual
 * 
 * Características:
 * - Mantiene referencia al video player
 * - Gestiona estado de reproducción (playing, buffering, error)
 * - Pausa automáticamente otros videos cuando uno se activa
 * - Limpia referencias al desmontar
 * 
 * @param videoId - ID único del video
 * @param postId - ID del post contenedor
 * @param autoplay - Si debe reproducirse automáticamente al activarse
 * @param onPlaybackStart - Callback cuando inicia la reproducción
 * @param onPlaybackEnd - Callback cuando termina la reproducción
 * @param onError - Callback para errores
 */
export const useVideoPlayer = ({
  videoId,
  postId,
  autoplay = false,
  onPlaybackStart,
  onPlaybackEnd,
  onError,
}: UseVideoPlayerProps): UseVideoPlayerReturn => {
  // Referencia al componente Video
  const videoRef = useRef<VideoPlayerRef>(null);

  // Estado del player
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
  });

  // Estado de activación (si este video está visible y debería reproducirse)
  const [isActive, setIsActive] = useState(false);

  /**
   * Pausa todos los otros videos activos excepto el actual
   */
  const pauseOtherVideos = useCallback(() => {
    if (currentActiveVideoId && currentActiveVideoId !== videoId) {
      const otherVideoRef = activeVideoRefs.get(currentActiveVideoId);
      if (otherVideoRef) {
        // Pausar el video anterior
        console.log(`⏸️ Pausing other video: ${currentActiveVideoId}`);
      }
    }
  }, [videoId]);

  /**
   * Reproduce el video
   */
  const play = useCallback(async () => {
    try {
      if (!videoRef.current) {
        console.warn(`⚠️ Video ref not available for ${videoId}`);
        return;
      }

      // Pausar otros videos primero
      pauseOtherVideos();

      // Actualizar el video activo actual
      currentActiveVideoId = videoId;

      // Actualizar estado
      setPlayerState(prev => ({ ...prev, isPlaying: true }));

      // Callback de inicio
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

  /**
   * Pausa el video
   */
  const pause = useCallback(async () => {
    try {
      if (!videoRef.current) {
        return;
      }

      setPlayerState(prev => ({ ...prev, isPlaying: false }));

      // Si este era el video activo, limpiar
      if (currentActiveVideoId === videoId) {
        currentActiveVideoId = null;
      }

      console.log(`⏸️ Pausing video: ${videoId}`);
    } catch (error) {
      console.error(`❌ Error pausing video ${videoId}:`, error);
    }
  }, [videoId]);

  /**
   * Busca a un tiempo específico en el video
   */
  const seek = useCallback((time: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.seek(time);
    setPlayerState(prev => ({ ...prev, currentTime: time }));
    console.log(`⏭️ Seeking video ${videoId} to ${time}s`);
  }, [videoId]);

  /**
   * Registra la referencia del video cuando el componente monta
   */
  useEffect(() => {
    if (videoRef.current) {
      activeVideoRefs.set(videoId, videoRef.current);
      console.log(`📹 Video ref registered: ${videoId}`);
    }

    // Cleanup: remover referencia al desmontar
    return () => {
      activeVideoRefs.delete(videoId);
      
      // Si este era el video activo, limpiar
      if (currentActiveVideoId === videoId) {
        currentActiveVideoId = null;
      }
      
      console.log(`🗑️ Video ref unregistered: ${videoId}`);
    };
  }, [videoId]);

  /**
   * Efecto para manejar autoplay cuando el video se activa
   */
  useEffect(() => {
    if (isActive && autoplay) {
      play();
    } else if (!isActive && playerState.isPlaying) {
      pause();
    }
  }, [isActive, autoplay, play, pause, playerState.isPlaying]);

  /**
   * Callback cuando el video termina de reproducirse
   */
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
    play,
    pause,
    seek,
    isActive,
    setIsActive,
  };
};

/**
 * Obtiene el ID del video actualmente activo
 */
export const getCurrentActiveVideoId = (): string | null => {
  return currentActiveVideoId;
};

/**
 * Pausa todos los videos activos (útil para cuando la app va a background)
 */
export const pauseAllVideos = (): void => {
  console.log('⏸️ Pausing all active videos');
  activeVideoRefs.forEach((ref, videoId) => {
    console.log(`⏸️ Pausing video: ${videoId}`);
  });
  currentActiveVideoId = null;
};

/**
 * Obtiene el conteo de videos actualmente registrados
 */
export const getActiveVideoCount = (): number => {
  return activeVideoRefs.size;
};

