/**
 * VideoCarousel Component
 * 
 * Carrusel horizontal de videos con paginación y gestión de visibilidad.
 * Optimizado para performance con virtualización y detección de item activo.
 */

import { UI_CONFIG } from '@/constants';
import { Video as VideoType } from '@/types';
import React, { memo, useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
    ViewToken,
} from 'react-native';
import VideoTile from './VideoTile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoCarouselProps {
  videos: VideoType[];
  postId: string;
  isPostActive: boolean;
  onVideoChange?: (videoIndex: number) => void;
}

/**
 * VideoCarousel - Carrusel horizontal de videos
 * 
 * Características:
 * - FlatList horizontal con paginación
 * - Detección automática del video visible
 * - Solo reproduce el video actualmente visible
 * - Optimizado con windowSize y removeClippedSubviews
 * - Memoizado para evitar re-renders
 * 
 * @param videos - Array de videos a mostrar
 * @param postId - ID del post contenedor
 * @param isPostActive - Si el post está visible en el feed vertical
 * @param onVideoChange - Callback cuando cambia el video activo
 */
const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  postId,
  isPostActive,
  onVideoChange,
}) => {
  // Estado del índice del video activo
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Ref para el FlatList
  const flatListRef = useRef<FlatList>(null);

  /**
   * Handler para cambios de visibilidad de items
   * Detecta qué video está visible actualmente
   */
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setActiveVideoIndex(newIndex);
        
        if (onVideoChange) {
          onVideoChange(newIndex);
        }
        
        console.log(`📹 Active video changed to index ${newIndex} in post ${postId}`);
      }
    },
    [postId, onVideoChange]
  );

  /**
   * Configuración para detectar items visibles
   */
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item debe estar 50% visible
    minimumViewTime: 100, // Mínimo 100ms visible
  }).current;

  /**
   * Render de cada video tile
   */
  const renderVideoTile = useCallback(
    ({ item, index }: { item: VideoType; index: number }) => {
      // Solo el video en el índice activo y el post activo debe reproducirse
      const isActive = isPostActive && index === activeVideoIndex;

      return (
        <VideoTile
          video={item}
          postId={postId}
          isActive={isActive}
        />
      );
    },
    [postId, isPostActive, activeVideoIndex]
  );

  /**
   * Key extractor optimizado
   */
  const keyExtractor = useCallback((item: VideoType) => item.id, []);

  /**
   * Separador entre items (opcional)
   */
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: UI_CONFIG.VIDEO_WIDTH + UI_CONFIG.CAROUSEL_ITEM_SPACING,
      offset: (UI_CONFIG.VIDEO_WIDTH + UI_CONFIG.CAROUSEL_ITEM_SPACING) * index,
      index,
    }),
    []
  );

  /**
   * Handler para scroll (opcional, para efectos adicionales)
   */
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Aquí podrías agregar lógica adicional como:
    // - Throttling de scroll
    // - Efectos de parallax
    // - Prefetch de videos siguientes
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoTile}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={UI_CONFIG.VIDEO_WIDTH + UI_CONFIG.CAROUSEL_ITEM_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        // Optimizaciones de performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        // Estilos
        contentContainerStyle={styles.contentContainer}
        style={styles.flatList}
      />

      {/* Indicadores de paginación (dots) */}
      {videos.length > 1 && (
        <View style={styles.pagination}>
          {videos.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                index === activeVideoIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: UI_CONFIG.VIDEO_HEIGHT,
    marginVertical: 12,
  },
  flatList: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: (SCREEN_WIDTH - UI_CONFIG.VIDEO_WIDTH) / 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#007AFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

// Memoización para evitar re-renders innecesarios
// Solo re-renderiza si cambian videos, postId o isPostActive
export default memo(VideoCarousel, (prevProps, nextProps) => {
  return (
    prevProps.videos.length === nextProps.videos.length &&
    prevProps.postId === nextProps.postId &&
    prevProps.isPostActive === nextProps.isPostActive &&
    prevProps.videos[0]?.id === nextProps.videos[0]?.id
  );
});

