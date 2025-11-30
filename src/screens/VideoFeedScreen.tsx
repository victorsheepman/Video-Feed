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

const ESTIMATED_POST_HEIGHT = UI_CONFIG.POST_HEIGHT;

interface IProps {
  initialPostIndex?: number;
}

const VideoFeedScreen: FC<IProps> = ({ initialPostIndex = 0 }) => {
  const [posts] = useState<Post[]>(mockPosts);
  const [activePostIndex, setActivePostIndex] = useState<number>(initialPostIndex);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const flatListRef = useRef<FlatList<Post>>(null);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: PERFORMANCE_CONFIG.VIEWPORT_VISIBLE_THRESHOLD * 100,
    minimumViewTime: 250, 
    waitForInteraction: false, 
  });

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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      
      if (viewableItems.length === 0) return;


      const visiblePost = viewableItems.find(
        (token) => token.isViewable && token.item
      );

      if (visiblePost && visiblePost.index !== null && visiblePost.index !== activePostIndex) {
        const newIndex = visiblePost.index;
        console.log(`📱 Post activo cambió: ${activePostIndex} → ${newIndex}`);
        
        setActivePostIndex(newIndex);
        setActiveVideoIndex(0); 

       
        prefetchNextPost();
      }
    }
  ).current;

  const handleVideoChange = useCallback((videoIndex: number) => {
    console.log(`🎬 Video cambió en post ${activePostIndex}: video ${videoIndex}`);
    setActiveVideoIndex(videoIndex);
    
    prefetchNextVideo();
  }, [activePostIndex, prefetchNextVideo]);

  
 
  const handleUserPress = useCallback((userId: string) => {
    console.log(`👤 Usuario presionado: ${userId}`);
   
  }, []);

  const handleRefresh = useCallback(async () => {
    console.log('🔄 Refrescando feed...');
    setIsRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));



    setIsRefreshing(false);
    console.log('✅ Feed refrescado');
  }, []);


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


  const keyExtractor = useCallback((item: Post) => item.id, []);

  
  const getItemLayout = useCallback(
    (_data: ArrayLike<Post> | null | undefined, index: number) => ({
      length: ESTIMATED_POST_HEIGHT,
      offset: ESTIMATED_POST_HEIGHT * index,
      index,
    }),
    []
  );

  const ItemSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);


  const EmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay posts disponibles</Text>
      <Text style={styles.emptySubtext}>
        Intenta refrescar el feed
      </Text>
    </View>
  ), []);

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
        
        
        getItemLayout={getItemLayout}
        initialNumToRender={3} 
        maxToRenderPerBatch={2} 
        windowSize={PERFORMANCE_CONFIG.FLASH_LIST_WINDOW_SIZE} 
        updateCellsBatchingPeriod={PERFORMANCE_CONFIG.UPDATE_CELLS_BATCH_PERIOD}
        removeClippedSubviews={Platform.OS === 'android'} 
        
        
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        
        
        scrollEventThrottle={16} 
        decelerationRate="normal"
        bounces={true}
        
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#000"
            colors={['#000']}
          />
        }
        
        
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyComponent}
        ListHeaderComponent={HeaderComponent}
        
        
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        
        
        initialScrollIndex={initialPostIndex > 0 ? initialPostIndex : undefined}
        
        
        accessible={true}
        accessibilityLabel="Video feed"
        accessibilityRole="list"
        
        
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

