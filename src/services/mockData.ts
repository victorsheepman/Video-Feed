/**
 * Mock Data Service - Generación de datos de prueba
 */

import { Post, Video } from '@/types';
import { VIDEO_SOURCES, MOCK_USERS, MOCK_CAPTIONS } from '@/constants';

/**
 * Genera un array de videos aleatorios
 */
function generateVideosForPost(postId: string, count: number): Video[] {
  const videos: Video[] = [];
  
  for (let i = 0; i < count; i++) {
    const sourceIndex = Math.floor(Math.random() * VIDEO_SOURCES.length);
    const source = VIDEO_SOURCES[sourceIndex];
    
    videos.push({
      id: `video-${postId}-${i}`,
      url: source.url,
      thumbnailUrl: source.thumbnail,
      duration: source.duration,
      title: source.title,
      aspectRatio: 9 / 16, // Formato vertical
    });
  }
  
  return videos;
}

/**
 * Genera posts mock para testing
 */
export function generateMockPosts(count: number = 200): Post[] {
  const posts: Post[] = [];
  
  for (let i = 0; i < count; i++) {
    const userIndex = Math.floor(Math.random() * MOCK_USERS.length);
    const captionIndex = Math.floor(Math.random() * MOCK_CAPTIONS.length);
    const videoCount = Math.floor(Math.random() * 4) + 2; // 2-5 videos por post
    
    posts.push({
      id: `post-${i}`,
      videos: generateVideosForPost(`${i}`, videoCount),
      author: MOCK_USERS[userIndex],
      caption: MOCK_CAPTIONS[captionIndex],
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 1000),
      timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 30), // Últimos 30 días
    });
  }
  
  return posts;
}

/**
 * Simula un delay de red (para testing)
 */
export function simulateNetworkDelay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simula un error de red aleatorio (para testing)
 */
export function simulateRandomError(probability: number = 0.1): void {
  if (Math.random() < probability) {
    throw new Error('Simulated network error');
  }
}

