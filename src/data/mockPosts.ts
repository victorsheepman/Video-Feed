/**
 * Mock Posts Data - 200 posts con videos para testing
 * Datos realistas para simular un feed de producción
 */

import { Post } from '@/types';

/**
 * URLs de videos públicos de Google Cloud Storage
 * Videos de código abierto y libre uso
 */
const VIDEO_URLS = [
  // Blender Open Movies
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    duration: 596000, // 9:56
    title: 'Big Buck Bunny',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://download.blender.org/ED/cover.jpg',
    duration: 653000, // 10:53
    title: 'Elephants Dream',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://durian.blender.org/wp-content/uploads/2010/06/sintel_trailer_1080p.jpg',
    duration: 888000, // 14:48
    title: 'Sintel',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://mango.blender.org/wp-content/uploads/2012/05/01_thom_celia_bridge.jpg',
    duration: 734000, // 12:14
    title: 'Tears of Steel',
  },
  // Google Sample Videos
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    duration: 15000, // 0:15
    title: 'For Bigger Blazes',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    duration: 15000, // 0:15
    title: 'For Bigger Escapes',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    duration: 60000, // 1:00
    title: 'For Bigger Fun',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    duration: 15000, // 0:15
    title: 'For Bigger Joyrides',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
    duration: 15000, // 0:15
    title: 'For Bigger Meltdowns',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    duration: 30000, // 0:30
    title: 'Subaru Adventure',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
    duration: 23000, // 0:23
    title: 'VW GTI Review',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
    duration: 31000, // 0:31
    title: 'Bullrun Adventure',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg',
    duration: 20000, // 0:20
    title: 'Car for a Grand',
  },
];

/**
 * Usuarios mock con datos realistas
 */
const MOCK_USERS = [
  { id: 'u1', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u2', name: 'Maria Santos', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'u3', name: 'David Chen', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 'u4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: 'u5', name: 'James Thompson', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'u6', name: 'Emma Johnson', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u7', name: 'Michael Lee', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 'u8', name: 'Sophia Martinez', avatar: 'https://i.pravatar.cc/150?img=31' },
  { id: 'u9', name: 'Daniel Kim', avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 'u10', name: 'Olivia Brown', avatar: 'https://i.pravatar.cc/150?img=29' },
  { id: 'u11', name: 'Ryan Garcia', avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 'u12', name: 'Isabella Wilson', avatar: 'https://i.pravatar.cc/150?img=45' },
  { id: 'u13', name: 'Lucas Anderson', avatar: 'https://i.pravatar.cc/150?img=52' },
  { id: 'u14', name: 'Mia Taylor', avatar: 'https://i.pravatar.cc/150?img=48' },
  { id: 'u15', name: 'Ethan Davis', avatar: 'https://i.pravatar.cc/150?img=59' },
  { id: 'u16', name: 'Ava Martinez', avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: 'u17', name: 'Noah Rodriguez', avatar: 'https://i.pravatar.cc/150?img=51' },
  { id: 'u18', name: 'Charlotte Miller', avatar: 'https://i.pravatar.cc/150?img=38' },
  { id: 'u19', name: 'Liam Moore', avatar: 'https://i.pravatar.cc/150?img=56' },
  { id: 'u20', name: 'Amelia Jackson', avatar: 'https://i.pravatar.cc/150?img=41' },
];

/**
 * Captions variados y realistas
 */
const MOCK_CAPTIONS = [
  '🎬 Amazing footage! You have to see this',
  '🔥 This is absolutely incredible',
  '✨ Just discovered this gem',
  '😍 Can\'t stop watching this',
  '🎥 Best content I\'ve seen today',
  '🌟 Pure magic captured on camera',
  '💯 This deserves more attention',
  '🚀 Mind-blowing visuals',
  '💫 Such beautiful cinematography',
  '🎭 This hits different',
  '🌈 Colors on point!',
  '⚡️ The energy in this is insane',
  '🎨 Visual masterpiece',
  '🏆 Award-worthy content right here',
  '💎 Hidden gem alert',
  '🌍 This changed my perspective',
  '🎯 Exactly what I needed today',
  '🔮 Future classic',
  '💪 Motivation level: 1000',
  '🌊 Flowing with good vibes',
  '🎪 Entertainment at its finest',
  '🎸 The soundtrack though 🔥',
  '📸 Perfect timing on this shot',
  '🌺 Nature is incredible',
  '🚗 Dream content right here',
  '✈️ Travel goals unlocked',
  '🏔 Adventure calling',
  '🌅 That golden hour magic',
  '🎬 Cinema quality',
  '💝 Sharing this with everyone',
];

/**
 * Genera un número aleatorio entre min y max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Selecciona un elemento aleatorio de un array
 */
const randomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Genera un timestamp aleatorio dentro de los últimos 30 días
 */
const randomTimestamp = (): number => {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return Math.floor(Math.random() * (now - thirtyDaysAgo)) + thirtyDaysAgo;
};

/**
 * Genera métricas realistas (likes, comments)
 * Posts más antiguos tienden a tener más engagement
 */
const generateMetrics = (timestamp: number) => {
  const age = Date.now() - timestamp;
  const ageInHours = age / (1000 * 60 * 60);
  
  // Posts más antiguos tienen más engagement
  const baseLikes = Math.floor(Math.random() * 1000);
  const ageFactor = Math.min(ageInHours / 24, 30); // Max 30 días
  const likes = Math.floor(baseLikes + (ageFactor * 200));
  
  // Comments son ~10% de los likes en promedio
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));
  
  return { likes, comments };
};

/**
 * Genera 200 posts con datos realistas
 */
export const mockPosts: Post[] = Array.from({ length: 200 }, (_, index) => {
  // Generar 3-5 videos por post
  const videoCount = randomInt(3, 5);
  const timestamp = randomTimestamp();
  const metrics = generateMetrics(timestamp);
  const user = randomItem(MOCK_USERS);
  
  // Seleccionar videos aleatorios sin repetir en el mismo post
  const selectedVideoIndices = new Set<number>();
  while (selectedVideoIndices.size < videoCount) {
    selectedVideoIndices.add(randomInt(0, VIDEO_URLS.length - 1));
  }
  
  const videos = Array.from(selectedVideoIndices).map((videoIndex, i) => {
    const videoData = VIDEO_URLS[videoIndex];
    return {
      id: `video-${index}-${i}`,
      url: videoData.url,
      thumbnailUrl: videoData.thumbnail,
      duration: videoData.duration,
      title: videoData.title,
      aspectRatio: 16 / 9, // Formato horizontal
    };
  });
  
  return {
    id: `post-${index}`,
    videos,
    author: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    },
    caption: randomItem(MOCK_CAPTIONS),
    likes: metrics.likes,
    comments: metrics.comments,
    timestamp,
  };
});

/**
 * Obtiene un subset de posts (útil para testing incremental)
 */
export const getMockPosts = (count?: number): Post[] => {
  if (count && count < mockPosts.length) {
    return mockPosts.slice(0, count);
  }
  return mockPosts;
};

/**
 * Obtiene un post específico por ID
 */
export const getMockPostById = (postId: string): Post | undefined => {
  return mockPosts.find(post => post.id === postId);
};

/**
 * Obtiene posts de un usuario específico
 */
export const getMockPostsByUser = (userId: string): Post[] => {
  return mockPosts.filter(post => post.author.id === userId);
};

/**
 * Estadísticas de los datos mock
 */
export const mockDataStats = {
  totalPosts: mockPosts.length,
  totalVideos: mockPosts.reduce((sum, post) => sum + post.videos.length, 0),
  totalUsers: MOCK_USERS.length,
  totalLikes: mockPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
  totalComments: mockPosts.reduce((sum, post) => sum + (post.comments || 0), 0),
  avgVideosPerPost: (mockPosts.reduce((sum, post) => sum + post.videos.length, 0) / mockPosts.length).toFixed(2),
  avgLikesPerPost: Math.floor(mockPosts.reduce((sum, post) => sum + (post.likes || 0), 0) / mockPosts.length),
};

// Log de estadísticas en desarrollo
if (__DEV__) {
  console.log('📊 Mock Data Stats:', mockDataStats);
}

export default mockPosts;

