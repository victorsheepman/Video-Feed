

import { PREFETCH_CONFIG } from '@/constants';
import { Post, Video } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  currentPostIndex: number;
  currentVideoIndex: number;
  posts: Post[];
  enabled?: boolean;
}

const globalPrefetchedUrls = new Set<string>();

const prefetchQueue: (() => Promise<void>)[] = [];
let activePrefetches = 0;


const processQueue = async () => {
  if (activePrefetches >= PREFETCH_CONFIG.maxConcurrent || prefetchQueue.length === 0) {
    return;
  }

  const task = prefetchQueue.shift();
  if (!task) return;

  activePrefetches++;
  
  try {
    await task();
  } catch (error) {
    console.error('❌ Prefetch error:', error);
  } finally {
    activePrefetches--;
    processQueue(); // Procesar siguiente en queue
  }
};

  
const enqueuePrefetch = (task: () => Promise<void>) => {
  prefetchQueue.push(task);
  processQueue();
};


const prefetchVideo = async (url: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`🔄 Prefetching video: ${url.substring(0, 50)}...`);
    

    setTimeout(() => {
      globalPrefetchedUrls.add(url);
      console.log(`✅ Prefetched: ${url.substring(0, 50)}...`);
      resolve();
    }, 100);
  });
};


export const usePrefetch = ({
  currentPostIndex,
  currentVideoIndex,
  posts,
  enabled = PREFETCH_CONFIG.enabled,
}: IProps) => {
 
  const [prefetchedUrls, setPrefetchedUrls] = useState<Set<string>>(new Set());
  const [isPrefetching, setIsPrefetching] = useState(false);


  const lastPrefetchedPostRef = useRef<number>(-1);
  const lastPrefetchedVideoRef = useRef<number>(-1);


  const prefetchSingleVideo = useCallback(async (video: Video) => {
    if (globalPrefetchedUrls.has(video.url)) {
      console.log(`⏭️ Already prefetched: ${video.id}`);
      return;
    }

    setIsPrefetching(true);

    enqueuePrefetch(async () => {
      try {
        await prefetchVideo(video.url);
        
      
        if (video.thumbnailUrl && !globalPrefetchedUrls.has(video.thumbnailUrl)) {
          await prefetchVideo(video.thumbnailUrl);
        }

        setPrefetchedUrls(prev => new Set(prev).add(video.url));
      } catch (error) {
        console.error(`❌ Error prefetching video ${video.id}:`, error);
      }
    });

    setIsPrefetching(false);
  }, []);


  const prefetchNextVideo = useCallback(() => {
    if (!enabled || !PREFETCH_CONFIG.nextVideo) {
      return;
    }

    const currentPost = posts[currentPostIndex];
    if (!currentPost) return;

    const nextVideoIndex = currentVideoIndex + PREFETCH_CONFIG.prefetchDistance;
    const nextVideo = currentPost.videos[nextVideoIndex];

    if (nextVideo && lastPrefetchedVideoRef.current !== nextVideoIndex) {
      console.log(`🎥 Prefetching next video in carousel: ${nextVideo.id}`);
      prefetchSingleVideo(nextVideo);
      lastPrefetchedVideoRef.current = nextVideoIndex;
    }
  }, [enabled, posts, currentPostIndex, currentVideoIndex, prefetchSingleVideo]);

  
  const prefetchNextPost = useCallback(() => {
    if (!enabled || !PREFETCH_CONFIG.nextPost) {
      return;
    }

    const nextPostIndex = currentPostIndex + PREFETCH_CONFIG.prefetchDistance;
    const nextPost = posts[nextPostIndex];

    if (nextPost && lastPrefetchedPostRef.current !== nextPostIndex) {
      console.log(`📝 Prefetching next post: ${nextPost.id}`);
      
     
      const firstVideo = nextPost.videos[0];
      if (firstVideo) {
        prefetchSingleVideo(firstVideo);
      }

      lastPrefetchedPostRef.current = nextPostIndex;
    }
  }, [enabled, posts, currentPostIndex, prefetchSingleVideo]);


  const prefetchPreviousPost = useCallback(() => {
    if (!enabled) {
      return;
    }

    const prevPostIndex = currentPostIndex - 1;
    const prevPost = posts[prevPostIndex];

    if (prevPost && prevPostIndex >= 0) {
      console.log(`📝 Prefetching previous post: ${prevPost.id}`);
      
      const firstVideo = prevPost.videos[0];
      if (firstVideo) {
        prefetchSingleVideo(firstVideo);
      }
    }
  }, [enabled, posts, currentPostIndex, prefetchSingleVideo]);


  useEffect(() => {
    if (!enabled) return;

   
    prefetchNextVideo();

   
    prefetchNextPost();
  }, [enabled, currentPostIndex, currentVideoIndex, prefetchNextVideo, prefetchNextPost]);

  
  useEffect(() => {
    return () => {
    
      lastPrefetchedPostRef.current = -1;
      lastPrefetchedVideoRef.current = -1;
    };
  }, []);

  return {
    isPrefetching,
    prefetchedUrls,
    prefetchNextPost,
    prefetchNextVideo,
    prefetchPreviousPost
  };
};


export const useAutoPrefetch = ({
  currentPostIndex,
  currentVideoIndex,
  posts,
  enabled = PREFETCH_CONFIG.enabled,
}: IProps) => {
  const prefetch = usePrefetch({
    currentPostIndex,
    currentVideoIndex,
    posts,
    enabled,
  });

 
  return prefetch;
};


export const clearPrefetchCache = () => {
  console.log('🗑️ Clearing prefetch cache');
  globalPrefetchedUrls.clear();
  prefetchQueue.length = 0;
  activePrefetches = 0;
};


export const getPrefetchStats = () => {
  return {
    totalPrefetched: globalPrefetchedUrls.size,
    queueSize: prefetchQueue.length,
    activePrefetches,
    maxConcurrent: PREFETCH_CONFIG.maxConcurrent,
  };
};

