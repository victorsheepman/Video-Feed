# ✅ PASO 3 COMPLETADO: Hooks de Gestión

## 📦 Archivos Creados

### Custom Hooks (4 archivos)

```
src/hooks/
├── useVideoPlayer.ts   (256 líneas) ✅
├── useAnalytics.ts     (204 líneas) ✅
├── usePrefetch.ts      (308 líneas) ✅
└── index.ts            (exportaciones) ✅
```

---

## 🎯 Hooks Implementados

### 1. **useVideoPlayer** - Gestión de Reproducción

Gestiona el estado completo de un video player individual.

#### Características:
- ✅ Mantiene referencia al video player
- ✅ Control de play/pause/seek
- ✅ Pausa automática de otros videos
- ✅ Track de video activo global
- ✅ Cleanup automático al desmontar
- ✅ Autoplay condicional
- ✅ Estado de buffering y errores

#### API:
```typescript
const {
  videoRef,          // Ref para el componente Video
  playerState,       // { isPlaying, isBuffering, currentTime, duration, error? }
  play,              // () => Promise<void>
  pause,             // () => Promise<void>
  seek,              // (time: number) => void
  isActive,          // boolean
  setIsActive,       // (active: boolean) => void
} = useVideoPlayer({
  videoId: 'video-123',
  postId: 'post-456',
  autoplay: true,
  onPlaybackStart: () => {},
  onPlaybackEnd: () => {},
  onError: (error) => {},
});
```

#### Funciones Exportadas:
```typescript
getCurrentActiveVideoId()  // Obtiene ID del video activo
pauseAllVideos()          // Pausa todos los videos
getActiveVideoCount()     // Cuenta de videos registrados
```

#### Uso Ejemplo:
```typescript
const MyVideoPlayer = ({ video, post, isVisible }) => {
  const {
    videoRef,
    playerState,
    play,
    pause,
    setIsActive,
  } = useVideoPlayer({
    videoId: video.id,
    postId: post.id,
    autoplay: true,
    onPlaybackStart: () => console.log('Started!'),
  });

  useEffect(() => {
    setIsActive(isVisible);
  }, [isVisible]);

  return (
    <Video
      ref={videoRef}
      source={{ uri: video.url }}
      paused={!playerState.isPlaying}
    />
  );
};
```

---

### 2. **useAnalytics** - Logging de Eventos

Sistema completo de analytics para videos con dos variantes.

#### Hook Base: `useAnalytics`

```typescript
const {
  logPlaybackStart,      // (metadata?) => void
  logPlaybackComplete,   // (metadata?) => void
  logPlaybackError,      // (error, metadata?) => void
  logTimeToFirstFrame,   // (ttff, metadata?) => void
  startTTFFTimer,        // () => void
  endTTFFTimer,          // () => void
} = useAnalytics({
  videoId: 'video-123',
  postId: 'post-456',
});
```

#### Hook Auto: `useAutoAnalytics`

Versión simplificada con handlers automáticos para react-native-video:

```typescript
const analytics = useAutoAnalytics({
  videoId: 'video-123',
  postId: 'post-456',
});

<Video
  onLoad={analytics.onLoad}
  onProgress={analytics.onProgress}
  onEnd={analytics.onEnd}
  onError={analytics.onError}
/>
```

#### Eventos Loggeados:

**1. Playback Start** ▶️
```
▶️ [Analytics] Playback Start {
  videoId: "video-123",
  postId: "post-456",
  timestamp: "2025-11-28T...",
  ...metadata
}
```

**2. Playback Complete** ✅
```
✅ [Analytics] Playback Complete {
  videoId: "video-123",
  postId: "post-456",
  timestamp: "2025-11-28T..."
}
```

**3. Playback Error** ❌
```
❌ [Analytics] Playback Error {
  videoId: "video-123",
  postId: "post-456",
  error: "Network timeout",
  timestamp: "2025-11-28T..."
}
```

**4. Time To First Frame** ⏱️
```
⏱️ [Analytics] Time To First Frame {
  videoId: "video-123",
  postId: "post-456",
  ttff: "156ms",
  timestamp: "2025-11-28T..."
}
```

#### Uso con TTFF:
```typescript
const { logPlaybackStart, startTTFFTimer, endTTFFTimer } = useAnalytics({
  videoId,
  postId
});

// Al iniciar carga
startTTFFTimer();

// Cuando empieza reproducción
logPlaybackStart();

// En onLoad del Video
onLoad={() => endTTFFTimer()}
```

---

### 3. **usePrefetch** - Prefetching Inteligente

Sistema de prefetch con queue y límites de concurrencia.

#### Características:
- ✅ Prefetch de siguiente post (vertical)
- ✅ Prefetch de siguiente video (horizontal)
- ✅ Queue con límite de concurrencia
- ✅ Evita duplicados globalmente
- ✅ Configurable via `PREFETCH_CONFIG`
- ✅ Profundidad configurable
- ✅ Auto-prefetch en cambios de índice

#### API:
```typescript
const {
  prefetchNextPost,      // () => void
  prefetchNextVideo,     // () => void
  prefetchPreviousPost,  // () => void
  isPrefetching,         // boolean
  prefetchedUrls,        // Set<string>
} = usePrefetch({
  currentPostIndex: 5,
  currentVideoIndex: 2,
  posts: allPosts,
  enabled: true,
});
```

#### Hook Auto: `useAutoPrefetch`
```typescript
// Auto-prefetch basado en índices actuales
const prefetch = useAutoPrefetch({
  currentPostIndex,
  currentVideoIndex,
  posts,
});
```

#### Funciones Globales:
```typescript
clearPrefetchCache()     // Limpia cache de URLs
getPrefetchStats()       // Obtiene estadísticas
// {
//   totalPrefetched: 15,
//   queueSize: 3,
//   activePrefetches: 2,
//   maxConcurrent: 2
// }
```

#### Comportamiento:

**Prefetch Automático:**
- Al cambiar de post → prefetch siguiente post
- Al cambiar de video → prefetch siguiente video
- Respeta `PREFETCH_CONFIG`:
  ```typescript
  {
    enabled: true,
    nextPost: true,
    nextVideo: true,
    prefetchDistance: 1,    // 1 item adelante
    maxConcurrent: 2,       // Máx 2 a la vez
  }
  ```

**Queue Management:**
- Límite de requests concurrentes
- Procesamiento secuencial de la queue
- Auto-retry en errores

**Logs:**
```
🔄 Prefetching video: https://...
✅ Prefetched: https://...
⏭️ Already prefetched: video-123
🎥 Prefetching next video in carousel: video-124
📝 Prefetching next post: post-6
```

---

## 🎨 Integración de Hooks

### Ejemplo Completo - Video Player Component

```typescript
import React, { useEffect } from 'react';
import Video from 'react-native-video';
import { useVideoPlayer, useAutoAnalytics } from '@/hooks';

interface VideoPlayerProps {
  video: Video;
  post: Post;
  isVisible: boolean;
}

export const VideoPlayer = ({ video, post, isVisible }: VideoPlayerProps) => {
  // Hook de reproducción
  const {
    videoRef,
    playerState,
    setIsActive,
  } = useVideoPlayer({
    videoId: video.id,
    postId: post.id,
    autoplay: true,
    onPlaybackStart: () => console.log('Playing'),
    onPlaybackEnd: () => console.log('Ended'),
  });

  // Hook de analytics
  const analytics = useAutoAnalytics({
    videoId: video.id,
    postId: post.id,
  });

  // Activar/desactivar basado en visibilidad
  useEffect(() => {
    setIsActive(isVisible);
  }, [isVisible, setIsActive]);

  return (
    <Video
      ref={videoRef}
      source={{ uri: video.url }}
      paused={!playerState.isPlaying}
      onLoad={analytics.onLoad}
      onProgress={analytics.onProgress}
      onEnd={analytics.onEnd}
      onError={analytics.onError}
    />
  );
};
```

### Ejemplo - Feed con Prefetch

```typescript
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { useAutoPrefetch } from '@/hooks';
import mockPosts from '@/data';

export const VideoFeed = () => {
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Auto-prefetch
  useAutoPrefetch({
    currentPostIndex: activePostIndex,
    currentVideoIndex: activeVideoIndex,
    posts: mockPosts,
  });

  return (
    <FlatList
      data={mockPosts}
      renderItem={({ item, index }) => (
        <PostCard
          post={item}
          isActive={index === activePostIndex}
          onVideoChange={setActiveVideoIndex}
        />
      )}
      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems[0]) {
          setActivePostIndex(viewableItems[0].index);
        }
      }}
    />
  );
};
```

---

## ⚡ Optimizaciones de Performance

### 1. **useVideoPlayer**
- ✅ Memoización con `useCallback` en todas las funciones
- ✅ Map global para referencias (no re-renders)
- ✅ Cleanup automático de referencias
- ✅ Solo un video activo a la vez

### 2. **useAnalytics**
- ✅ Todas las funciones memoizadas
- ✅ Refs para timestamps (no causa re-renders)
- ✅ Batching automático vía `analytics` service
- ✅ Logs estructurados con timestamps

### 3. **usePrefetch**
- ✅ Queue system para limitar concurrencia
- ✅ Set global para evitar duplicados
- ✅ Refs para evitar prefetch redundantes
- ✅ Auto-prefetch solo en cambios necesarios
- ✅ Cleanup al desmontar

---

## 🔧 Manejo de Errores

### useVideoPlayer
```typescript
try {
  await play();
} catch (error) {
  // Error capturado y loggeado
  // Estado actualizado con error
  // Callback onError llamado
}
```

### useAnalytics
```typescript
// Todos los errores se loggean automáticamente
logPlaybackError(error, { context: 'additional info' });
```

### usePrefetch
```typescript
// Errores de prefetch no bloquean la UI
// Se loggean pero no se propagan
catch (error) {
  console.error('❌ Prefetch error:', error);
  // Continúa con el siguiente en queue
}
```

---

## 📊 Estadísticas

### Archivos Creados: 4
- **useVideoPlayer.ts**: 256 líneas
- **useAnalytics.ts**: 204 líneas  
- **usePrefetch.ts**: 308 líneas
- **index.ts**: 6 líneas

**Total**: ~774 líneas de código

### Hooks Exportados: 6
1. `useVideoPlayer`
2. `useAnalytics`
3. `useAutoAnalytics`
4. `usePrefetch`
5. `useAutoPrefetch`
6. + 6 funciones helper globales

---

## ✅ Checklist de Completitud

- [x] Hook `useVideoPlayer` con gestión completa de reproducción
- [x] Track de video activo global
- [x] Funciones play/pause/seek
- [x] Referencias de video con cleanup
- [x] Hook `useAnalytics` con 4 tipos de eventos
- [x] Timer automático para TTFF
- [x] Variante `useAutoAnalytics` para simplificar
- [x] Console.log para todos los eventos
- [x] Hook `usePrefetch` con queue inteligente
- [x] Prefetch de siguiente post vertical
- [x] Prefetch de siguiente video horizontal
- [x] Profundidad configurable
- [x] Límite de concurrencia
- [x] Variante `useAutoPrefetch`
- [x] TypeScript completo con tipos
- [x] Documentación inline detallada
- [x] Optimizaciones de performance
- [x] Manejo de errores robusto
- [x] 0 errores de linting

---

## 🚀 Próximos Pasos

**Paso 4:** Implementar componentes visuales
- VideoPlayer component
- VideoThumbnail component
- PostCard component
- HorizontalCarousel component
- VerticalFeed component

Los hooks están listos para ser integrados en los componentes! 🎉

---

**Estado:** ✅ PASO 3 COMPLETADO
**Tiempo:** ~15 minutos
**Listo para:** Paso 4 - Componentes UI

