# 🎥 High-Performance Video Feed - React Native

Una aplicación React Native de alto rendimiento que implementa un feed vertical de posts con carruseles horizontales de videos, similar a Twitter/TikTok.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Arquitectura](#-arquitectura)
- [Estrategias de Performance](#-estrategias-de-performance)
- [Configuración](#-configuración)
- [Testing](#-testing)
- [Estado del Proyecto](#-estado-del-proyecto)

## ✨ Características

### Implementadas

✅ **Setup Inicial (Pasos 1-2)**
- Estructura de carpetas organizada
- Tipos TypeScript completos
- Configuración de constantes y feature flags
- Sistema de analytics
- Utilidades de performance y retry logic
- Generación de datos mock (200+ posts)

✅ **Custom Hooks (Paso 3)**
- `useVideoPlayer` - Control de reproducción centralizado
- `usePrefetch` - Prefetching inteligente
- `useAnalytics` - Sistema de eventos

✅ **Componentes (Paso 4)**
- `VideoTile` - Tile individual de video
- `VideoCarousel` - Carrusel horizontal de videos
- `PostItem` - Item completo del post con header, carrusel y footer

✅ **Pantalla Principal (Paso 5)**
- `VideoFeedScreen` - Feed vertical optimizado con FlatList
- Detección de posts activos con viewability
- Gestión de recursos de videos inactivos
- Integración completa de hooks y componentes
- Solo un video reproduce a la vez

## 🔧 Requisitos

- Node.js >= 18
- npm o yarn
- Expo CLI
- iOS Simulator o Android Emulator
- (Opcional) Dispositivo físico para testing real

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm start

# 3. Ejecutar en iOS
npm run ios

# 4. Ejecutar en Android
npm run android
```

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── components/
│   ├── feed/          # Componentes del feed vertical
│   ├── video/         # Componentes del reproductor de video
│   └── ui/            # Componentes UI reutilizables
├── hooks/             # Custom hooks
├── services/          # Servicios y APIs
│   └── mockData.ts    # Generación de datos de prueba
├── store/             # Estado global (Zustand)
├── types/             # Definiciones TypeScript
├── utils/             # Utilidades
│   ├── analytics.ts   # Sistema de logging
│   ├── performance.ts # Monitoreo de FPS
│   └── retry.ts       # Lógica de reintentos
└── constants/         # Configuraciones y constantes
    ├── config.ts      # Feature flags y configuración
    └── videos.ts      # URLs de videos de prueba
```

### Componentes Principales

#### 1. VerticalFeed
- **Responsabilidad:** Lista virtualizada de posts
- **Tecnología:** FlashList (Shopify)
- **Optimizaciones:** 
  - Window size reducido (3 items)
  - Batch rendering optimizado
  - Viewport tracking para posts activos

#### 2. PostCard
- **Responsabilidad:** Contenedor individual de cada post
- **Características:**
  - Carrusel horizontal de videos
  - Gestión de estado activo/inactivo
  - Liberación de recursos cuando no visible

#### 3. HorizontalCarousel
- **Responsabilidad:** Scroll horizontal de videos
- **Características:**
  - Paginación automática
  - Detección de video visible
  - Prefetch del siguiente video

#### 4. VideoPlayer
- **Responsabilidad:** Reproducción de video individual
- **Tecnología:** react-native-video
- **Características:**
  - Autoplay condicional
  - Manejo de errores
  - Analytics integrado
  - Gestión de memoria

## ⚡ Estrategias de Performance

### 1. Virtualización Agresiva
- **FlashList** en lugar de FlatList (hasta 10x más rápido)
- `windowSize: 3` - Solo 3 posts en memoria
- `maxToRenderPerBatch: 2` - Renderiza 2 items por batch

### 2. Gestión de Memoria
- Máximo 3 players activos simultáneamente
- Descarga de videos fuera del viewport
- Pool de instancias de reproductor

### 3. Prefetching Inteligente
```typescript
PREFETCH_CONFIG = {
  enabled: true,
  nextPost: true,        // Precarga siguiente post
  nextVideo: true,       // Precarga siguiente video
  prefetchDistance: 1,   // 1 item adelante
  maxConcurrent: 2,      // Máx 2 descargas paralelas
}
```

### 4. Memoización
- `React.memo` en todos los componentes pesados
- `useMemo` para cálculos costosos
- `useCallback` para funciones en props

### 5. Optimización de Scroll
- Throttling de eventos de scroll
- Pausa automática en velocidad alta
- Debouncing de cambios de estado

## ⚙️ Configuración

### Feature Flags (`src/constants/config.ts`)

```typescript
// Performance
TARGET_FPS: 60
FLASH_LIST_WINDOW_SIZE: 3
MAX_TO_RENDER_PER_BATCH: 2

// Video Player
MAX_ACTIVE_PLAYERS: 3
AUTOPLAY: true
LOOP_VIDEOS: true

// Prefetching
PREFETCH_ENABLED: true
PREFETCH_DISTANCE: 1
MAX_CONCURRENT_PREFETCH: 2

// Analytics
LOG_TO_CONSOLE: true
BATCH_EVENTS: true
BATCH_SIZE: 10
```

## 🧪 Testing

### Dispositivos de Prueba

- **iOS:** iPhone 14 Pro (Simulator)
- **Android:** Pixel 7 (Emulator)
- **Target:** Dispositivos mid-tier

### Métricas de Performance

- **Target FPS:** 60 FPS
- **Tiempo de montaje:** < 100ms
- **Time-to-first-frame:** < 200ms
- **Memoria:** < 500MB para 200 posts

### Comandos de Testing

```bash
# Verificar linting
npm run lint

# Ejecutar en modo debug
npm start -- --clear

# Monitor de performance
# (Ver logs en consola para métricas de FPS y analytics)
```

## 📊 Analytics

El sistema registra automáticamente:

- ▶️ **Playback Start** - Inicio de reproducción
- ✅ **Playback Complete** - Video completado
- ❌ **Playback Error** - Errores de reproducción
- ⏱️ **Time-to-First-Frame** - TTFF para cada video

### Ejemplo de Log

```
▶️ [10:30:15] playback_start
  Video: video-post-42-2
  Post: post-42
  Metadata: {"buffering": false}

⏱️ [10:30:15] time_to_first_frame
  Video: video-post-42-2
  Post: post-42
  Metadata: {"ttff": 156}
```

## 🔄 Estado del Proyecto

### ✅ PASOS COMPLETADOS

#### **Paso 1-2: Setup e Infraestructura**
1. ✅ Instalación de dependencias
   - react-native-video
   - expo-image
   - zustand
   - babel-plugin-module-resolver

2. ✅ Estructura de carpetas
   - `/src` con subcarpetas organizadas
   - Separación clara de responsabilidades

3. ✅ Sistema de tipos TypeScript
   - Tipos para Video, Post, Analytics
   - Interfaces de configuración
   - VideoPlayerState, PrefetchConfig

4. ✅ Configuración y constantes
   - Feature flags configurables
   - URLs de videos de prueba (Google GTV, Blender)
   - Configuración de performance

5. ✅ Utilidades base
   - Sistema de analytics con batching
   - Monitor de performance (FPS tracking)
   - Lógica de reintentos con backoff exponencial

6. ✅ Servicio de datos mock
   - Generación de 200 posts realistas
   - 3-5 videos por post
   - Métricas de engagement

#### **Paso 3: Custom Hooks**
1. ✅ `useVideoPlayer`
   - Control centralizado de reproducción
   - Pausa automática de otros videos
   - Gestión de referencias y estado
   - Autoplay condicional

2. ✅ `usePrefetch`
   - Prefetch del siguiente post
   - Prefetch del siguiente video
   - Queue de prefetch con límites
   - Evita duplicados

3. ✅ `useAnalytics`
   - Logging de eventos de reproducción
   - Timer automático para TTFF
   - Integración con utils/analytics

#### **Paso 4: Componentes**
1. ✅ `VideoTile`
   - Reproducción de video individual
   - Controles de UI (play/pause, mute)
   - Indicador de buffering
   - Manejo de errores

2. ✅ `VideoCarousel`
   - Carrusel horizontal paginado
   - Detección de video visible
   - Solo reproduce el video activo
   - Indicadores de paginación

3. ✅ `PostItem`
   - Header con avatar y usuario
   - Integración del carrusel
   - Caption y métricas (likes, comments)
   - Footer con acciones

#### **Paso 5: Pantalla Principal**
1. ✅ `VideoFeedScreen`
   - FlatList vertical optimizado
   - `getItemLayout` para scroll rápido
   - `initialNumToRender={3}`
   - `windowSize={3}`
   - `removeClippedSubviews` (Android)
   - Viewability tracking (80% threshold)
   - Pull to refresh
   - Solo un video activo a la vez
   - Integración completa de hooks y componentes

### 🎉 Aplicación Funcional

La aplicación ahora tiene un feed vertical completamente funcional con:
- ✅ Scroll fluido y optimizado
- ✅ Reproducción automática del video visible
- ✅ Carruseles horizontales en cada post
- ✅ Prefetching inteligente
- ✅ Analytics integrado
- ✅ Performance optimizado

### 🚀 Próximos Pasos Sugeridos

**Mejoras Futuras:**
- [ ] Migrar a FlashList para mejor performance
- [ ] Implementar navegación a perfiles
- [ ] Agregar funcionalidad de likes y comentarios
- [ ] Integrar con API backend real
- [ ] Paginación infinita del feed
- [ ] Cache de videos localmente
- [ ] Soporte para modo offline
- [ ] Tests unitarios y de integración
- [ ] Tests de performance automatizados

## 🐛 Issues Conocidos

Ninguno por ahora - proyecto recién iniciado.

## 📝 Notas de Desarrollo

### Decisiones de Arquitectura

1. **FlashList vs FlatList:** FlashList elegido por su rendimiento superior en listas largas (10x más rápido según benchmarks de Shopify).

2. **expo-image vs react-native-fast-image:** Se usa expo-image (ya incluido) en lugar de react-native-fast-image por compatibilidad con React 19.

3. **Zustand vs Redux:** Zustand elegido por su simplicidad y menor overhead para este caso de uso.

4. **TypeScript strict mode:** Activado para mejor type safety y detección temprana de errores.

### Limitaciones Actuales

- Videos de prueba son de libre uso (Google GTV, Blender)
- Mock data genera variaciones aleatorias de los mismos videos
- Analytics solo hace logging a consola (no backend real)

## 📚 Recursos

- [React Native Video Docs](https://github.com/react-native-video/react-native-video)
- [FlashList Documentation](https://shopify.github.io/flash-list/)
- [Expo Documentation](https://docs.expo.dev/)

## 👨‍💻 Autor

Desarrollado como parte del challenge técnico: "High-Performance Video Feed"

## 📖 Documentación Detallada

Cada paso completado tiene su propia documentación detallada:

- 📄 [PASO_2_COMPLETE.md](./PASO_2_COMPLETE.md) - Tipos y Constantes
- 📄 [PASO_3_COMPLETE.md](./PASO_3_COMPLETE.md) - Custom Hooks
- 📄 [PASO_4_COMPLETE.md](./PASO_4_COMPLETE.md) - Componentes
- 📄 [PASO_5_COMPLETE.md](./PASO_5_COMPLETE.md) - Pantalla de Feed

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0 (Pasos 1-5 completados - Aplicación funcional)
