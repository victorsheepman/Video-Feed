

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

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  postId,
  isPostActive,
  onVideoChange,
}) => {
  
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  
  const flatListRef = useRef<FlatList>(null);

 
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

  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, 
    minimumViewTime: 100, 
  }).current;

  
  const renderVideoTile = useCallback(
    ({ item, index }: { item: VideoType; index: number }) => {
     
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

  
  const keyExtractor = useCallback((item: VideoType) => item.id, []);

  
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: UI_CONFIG.VIDEO_WIDTH + UI_CONFIG.CAROUSEL_ITEM_SPACING,
      offset: (UI_CONFIG.VIDEO_WIDTH + UI_CONFIG.CAROUSEL_ITEM_SPACING) * index,
      index,
    }),
    []
  );

  
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
   
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
       
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}

        contentContainerStyle={styles.contentContainer}
        style={styles.flatList}
      />

    
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


export default memo(VideoCarousel, (prevProps, nextProps) => {
  return (
    prevProps.videos.length === nextProps.videos.length &&
    prevProps.postId === nextProps.postId &&
    prevProps.isPostActive === nextProps.isPostActive &&
    prevProps.videos[0]?.id === nextProps.videos[0]?.id
  );
});

