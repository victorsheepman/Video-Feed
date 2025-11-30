

import { Post } from '@/types';
import { Image } from 'expo-image';
import React, { type FC, memo, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VideoCarousel from '../video/VideoCarousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IProps {
  post: Post;
  isActive: boolean;
  onVideoChange?: (videoIndex: number) => void;
  onUserPress?: (userId: string) => void;
}


const PostItem: FC<IProps> = ({
  post,
  isActive,
  onVideoChange,
  onUserPress,
}) => {
  
  const handleUserPress = useCallback(() => {
    if (onUserPress) {
      onUserPress(post.author.id);
    }
  }, [post.author.id, onUserPress]);

  
  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  
  const formatNumber = (num: number): string => {
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity
        style={styles.header}
        onPress={handleUserPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: post.author.avatar }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{getTimeAgo(post.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>

     
      <VideoCarousel
        videos={post.videos}
        postId={post.id}
        isPostActive={isActive}
        onVideoChange={onVideoChange}
      />

     
      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.username}>{post.author.name}</Text>
            {'  '}
            {post.caption}
          </Text>
        </View>
      )}

     
      <View style={styles.footer}>
       
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>❤️</Text>
          <Text style={styles.metricText}>
            {post.likes ? formatNumber(post.likes) : 0}
          </Text>
        </TouchableOpacity>

       
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>💬</Text>
          <Text style={styles.metricText}>
            {post.comments ? formatNumber(post.comments) : 0}
          </Text>
        </TouchableOpacity>

       
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>📤</Text>
          <Text style={styles.metricText}>Share</Text>
        </TouchableOpacity>


        <View style={styles.spacer} />

        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 24,
    color: '#666',
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#262626',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 16,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricIcon: {
    fontSize: 20,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#efefef',
    marginTop: 16,
  },
});


export default memo(PostItem, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.isActive === nextProps.isActive
  );
});

