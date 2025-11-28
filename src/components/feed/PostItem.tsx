/**
 * PostItem Component
 * 
 * Item completo de un post en el feed vertical.
 * Incluye header con info del usuario, carrusel de videos, caption y métricas.
 */

import { Post } from '@/types';
import { Image } from 'expo-image';
import React, { memo, useCallback } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import VideoCarousel from '../video/VideoCarousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostItemProps {
  post: Post;
  isActive: boolean;
  onVideoChange?: (videoIndex: number) => void;
  onUserPress?: (userId: string) => void;
}

/**
 * PostItem - Item completo del post en el feed vertical
 * 
 * Estructura:
 * - Header: Avatar, nombre del usuario, timestamp
 * - VideoCarousel: Carrusel horizontal de videos
 * - Caption: Texto del post
 * - Footer: Métricas (likes, comentarios)
 * 
 * @param post - Datos del post completo
 * @param isActive - Si el post está visible en el viewport
 * @param onVideoChange - Callback cuando cambia el video activo
 * @param onUserPress - Callback cuando se presiona el usuario
 */
const PostItem: React.FC<PostItemProps> = ({
  post,
  isActive,
  onVideoChange,
  onUserPress,
}) => {
  /**
   * Handler para presionar el perfil del usuario
   */
  const handleUserPress = useCallback(() => {
    if (onUserPress) {
      onUserPress(post.author.id);
    }
  }, [post.author.id, onUserPress]);

  /**
   * Formatea el timestamp a formato relativo (ej: "2h ago")
   */
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

  /**
   * Formatea números grandes (ej: 1.2K, 5.3M)
   */
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
      {/* Header - User Info */}
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

      {/* Video Carousel */}
      <VideoCarousel
        videos={post.videos}
        postId={post.id}
        isPostActive={isActive}
        onVideoChange={onVideoChange}
      />

      {/* Caption */}
      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.username}>{post.author.name}</Text>
            {'  '}
            {post.caption}
          </Text>
        </View>
      )}

      {/* Footer - Metrics */}
      <View style={styles.footer}>
        {/* Likes */}
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>❤️</Text>
          <Text style={styles.metricText}>
            {post.likes ? formatNumber(post.likes) : 0}
          </Text>
        </TouchableOpacity>

        {/* Comments */}
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>💬</Text>
          <Text style={styles.metricText}>
            {post.comments ? formatNumber(post.comments) : 0}
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>📤</Text>
          <Text style={styles.metricText}>Share</Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Bookmark */}
        <TouchableOpacity style={styles.metricButton}>
          <Text style={styles.metricIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
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

// Memoización para evitar re-renders innecesarios
// Solo re-renderiza si cambian post.id o isActive
export default memo(PostItem, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.isActive === nextProps.isActive
  );
});

