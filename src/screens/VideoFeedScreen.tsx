/**
 * VideoFeedScreen - Pantalla principal del feed de videos
 * 
 * PASO 5: Implementación completa del feed vertical con optimizaciones de performance
 * 
 * Características:
 * - FlatList vertical optimizado con getItemLayout
 * - Viewability tracking para detectar post activo
 * - Prefetching inteligente de videos
 * - Control de reproducción: solo un video activo a la vez
 * - Optimizaciones de memoria y scroll performance
 * - Integración con analytics
 */

import { PostItem } from '@/components';
import { PERFORMANCE_CONFIG, UI_CONFIG } from '@/constants';
import { mockPosts } from '@/data';
import { usePrefetch } from '@/hooks';
import { Post } from '@/types';
import React, { type FC, useCallback, useRef, useState } from 'react';
import {
    FlatList,
    type ListRenderItem,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    View,
    type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Altura estimada de cada post
 * Usada por getItemLayout para calcular posiciones sin medir
 */
const ESTIMATED_POST_HEIGHT = UI_CONFIG.POST_HEIGHT;

interface IProps {
  initialPostIndex?: number;
}

/**
 * VideoFeedScreen - Pantalla principal del feed vertical de videos
 * 
 * Performance Optimizations:
 * 1. getItemLayout: Evita mediciones costosas, mejora scroll rápido
 * 2. initialNumToRender: Renderiza solo items visibles al inicio
 * 3. windowSize: Limita items en memoria (3 = 1.5 pantallas arriba/abajo)
 * 4. maxToRenderPerBatch: Renderiza de a 2 items para no bloquear UI
 * 5. removeClippedSubviews: Desmonta items fuera de pantalla (Android)
 * 6. updateCellsBatchingPeriod: Retrasa actualizaciones para suavizar scroll
 * 7. keyExtractor optimizado: Evita re-renders innecesarios
 * 8. ViewabilityConfig: Detecta post activo al 80% visible
 * 
 * @param initialPostIndex - Índice inicial del feed (útil para deep links)
 */
const VideoFeedScreen: FC<IProps> = ({ initialPostIndex = 0 }) => {
  // Estado del feed
  const [posts] = useState<Post[]>(mockPosts);
  const [activePostIndex, setActivePostIndex] = useState<number>(initialPostIndex);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs
  const flatListRef = useRef<FlatList<Post>>(null);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: PERFORMANCE_CONFIG.VIEWPORT_VISIBLE_THRESHOLD * 100,
    minimumViewTime: 250, // ms - Tiempo mínimo para considerar un item como "visto"
    waitForInteraction: false, // Detectar viewability inmediatamente
  });

  // Prefetch hook - Precarga videos antes de que sean necesarios
  const {
    isPrefetching,
    prefetchNextPost,
    prefetchNextVideo,
  } = usePrefetch({
    currentPostIndex: activePostIndex,
    currentVideoIndex: activeVideoIndex,
    posts,
    enabled: true,
  });

  /**
   * Callback cuando cambia la visibilidad de los items
   * Detecta qué post está actualmente visible y activa su reproducción
   */
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Solo procesamos si hay items visibles
      if (viewableItems.length === 0) return;

      // El primer item totalmente visible es el post activo
      const visiblePost = viewableItems.find(
        (token) => token.isViewable && token.item
      );

      if (visiblePost && visiblePost.index !== null && visiblePost.index !== activePostIndex) {
        const newIndex = visiblePost.index;
        console.log(`📱 Post activo cambió: ${activePostIndex} → ${newIndex}`);
        
        setActivePostIndex(newIndex);
        setActiveVideoIndex(0); // Reset al primer video del nuevo post

        // Trigger prefetch del siguiente post
        prefetchNextPost();
      }
    }
  ).current;

  /**
   * Callback cuando cambia el video activo dentro de un post
   * Actualiza el índice y triggerea prefetch del siguiente video
   */
  const handleVideoChange = useCallback((videoIndex: number) => {
    console.log(`🎬 Video cambió en post ${activePostIndex}: video ${videoIndex}`);
    setActiveVideoIndex(videoIndex);
    
    // Prefetch del siguiente video en el carrusel
    prefetchNextVideo();
  }, [activePostIndex, prefetchNextVideo]);

  /**
   * Callback cuando el usuario presiona en un perfil
   * En una app real, navegar al perfil del usuario
   */
  const handleUserPress = useCallback((userId: string) => {
    console.log(`👤 Usuario presionado: ${userId}`);
    // TODO: Navegar a pantalla de perfil
    // navigation.navigate('Profile', { userId });
  }, []);

  /**
   * Pull to refresh - Recarga el feed
   * En producción, haría fetch de nuevos posts desde el backend
   */
  const handleRefresh = useCallback(async () => {
    console.log('🔄 Refrescando feed...');
    setIsRefreshing(true);

    // Simular fetch de datos
    await new Promise(resolve => setTimeout(resolve, 1500));

    // En una app real, aquí actualizarías el estado con nuevos posts
    // setPosts(await fetchNewPosts());

    setIsRefreshing(false);
    console.log('✅ Feed refrescado');
  }, []);

  /**
   * Render de cada item del feed
   * Memoizado con useCallback para evitar recrear la función
   */
  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item, index }) => {
      const isActive = index === activePostIndex;
      
      return (
        <PostItem
          post={item}
          isActive={isActive}
          onVideoChange={handleVideoChange}
          onUserPress={handleUserPress}
        />
      );
    },
    [activePostIndex, handleVideoChange, handleUserPress]
  );

  /**
   * Key extractor optimizado
   * Usa el ID del post directamente sin crear strings nuevas
   */
  const keyExtractor = useCallback((item: Post) => item.id, []);

  /**
   * getItemLayout - Optimización crítica para scroll performance
   * Permite a FlatList calcular posiciones sin medir cada item
   * 
   * Requisito: Todos los items deben tener altura consistente
   */
  const getItemLayout = useCallback(
    (_data: ArrayLike<Post> | null | undefined, index: number) => ({
      length: ESTIMATED_POST_HEIGHT,
      offset: ESTIMATED_POST_HEIGHT * index,
      index,
    }),
    []
  );

  /**
   * Separator component - Opcional, solo si necesitas separadores visuales
   */
  const ItemSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  /**
   * Empty component - Mostrado cuando no hay posts
   */
  const EmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay posts disponibles</Text>
      <Text style={styles.emptySubtext}>
        Intenta refrescar el feed
      </Text>
    </View>
  ), []);

  /**
   * Header component - Opcional, para mostrar logo o título
   */
  const HeaderComponent = useCallback(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Feed</Text>
      {isPrefetching && (
        <View style={styles.prefetchIndicator}>
          <Text style={styles.prefetchText}>⚡</Text>
        </View>
      )}
    </View>
  ), [isPrefetching]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        
        // Optimizaciones de Performance
        getItemLayout={getItemLayout}
        initialNumToRender={3} // Solo 3 posts iniciales
        maxToRenderPerBatch={2} // Renderizar de a 2 items
        windowSize={PERFORMANCE_CONFIG.FLASH_LIST_WINDOW_SIZE} // 3 = 1.5 pantallas
        updateCellsBatchingPeriod={PERFORMANCE_CONFIG.UPDATE_CELLS_BATCH_PERIOD}
        removeClippedSubviews={Platform.OS === 'android'} // Solo Android
        
        // Viewability Configuration
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        
        // Scroll Optimization
        scrollEventThrottle={16} // 60fps
        decelerationRate="normal"
        bounces={true}
        
        // Refresh Control
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#000"
            colors={['#000']}
          />
        }
        
        // Components
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyComponent}
        ListHeaderComponent={HeaderComponent}
        
        // Comportamiento
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        
        // Inicial
        initialScrollIndex={initialPostIndex > 0 ? initialPostIndex : undefined}
        
        // Accesibilidad
        accessible={true}
        accessibilityLabel="Video feed"
        accessibilityRole="list"
        
        // Style
        contentContainerStyle={
          posts.length === 0 ? styles.emptyContentContainer : undefined
        }
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatList: {
    flex: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  prefetchIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefetchText: {
    fontSize: 14,
  },
  separator: {
    height: 0,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default VideoFeedScreen;

