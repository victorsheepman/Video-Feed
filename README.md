# 🎥 High-Performance Video Feed - React Native

Una aplicación React Native de alto rendimiento que implementa un feed vertical de posts con carruseles horizontales de videos, similar a Twitter/TikTok.

## 📋 Tabla de Contenidos

- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Arquitectura](#-arquitectura)
- [Estrategias de Performance](#-estrategias-de-performance)
- [Configuración](#-configuración)
- [Testing](#-testing)


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
- **Tecnología:** `expo-av` (el player oficial de Expo que reemplaza al anteriormente mencionado `react-native-video`)
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

### 🎉 Aplicación Funcional

La aplicación ahora tiene un feed vertical completamente funcional con:
- ✅ Scroll fluido y optimizado
- ✅ Reproducción automática del video visible
- ✅ Carruseles horizontales en cada post
- ✅ Prefetching inteligente
- ✅ Analytics integrado
- ✅ Performance optimizado

### Decisiones de Arquitectura

1. **FlashList vs FlatList:** FlashList elegido por su rendimiento superior en listas largas (10x más rápido según benchmarks de Shopify).

2. **expo-image vs react-native-fast-image:** Se usa expo-image (ya incluido) en lugar de react-native-fast-image por compatibilidad con React 19.

3. **TypeScript strict mode:** Activado para mejor type safety y detección temprana de errores.

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
