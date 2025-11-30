# 🎬 Configuración del Video Player

## 📝 Estado Actual

La aplicación actualmente usa una **versión MOCK del video player** que simula la reproducción mostrando el thumbnail del video.

### ¿Por qué Mock?

- `react-native-video` requiere linking nativo
- Simplifica el desarrollo y testing inicial
- Permite probar toda la lógica sin dependencias nativas

---

## 🎥 Integrar Videos Reales

Para usar reproducción real de videos, sigue estos pasos:

### 1. Instalar react-native-video

```bash
npm install react-native-video
```

### 2. Configurar Expo (si usas Expo)

Si usas Expo, necesitas usar expo-video en su lugar:

```bash
npx expo install expo-av
```

### 3. Actualizar VideoTile.tsx

Reemplaza el mock en `src/components/video/VideoTile.tsx`:

#### Opción A: Con react-native-video (Bare React Native)

```typescript
import Video from 'react-native-video';

// En el render, reemplaza:
{playerState.isPlaying && (
  <Image
    source={{ uri: video.thumbnailUrl }}
    style={styles.video}
    contentFit="cover"
    transition={200}
  />
)}

// Por:
<Video
  ref={videoRef as any}
  source={{ uri: video.url }}
  style={styles.video}
  resizeMode="cover"
  paused={!playerState.isPlaying}
  repeat={false}
  onLoad={handleLoad}
  onProgress={handleProgress}
  onEnd={handleEnd}
  onError={handleError}
  playInBackground={false}
  playWhenInactive={false}
  ignoreSilentSwitch="ignore"
/>
```

#### Opción B: Con expo-av (Expo)

```typescript
import { Video } from 'expo-av';
import { useRef } from 'react';

// En el componente:
const videoRef = useRef<Video>(null);

// Implementar métodos play/pause:
const play = async () => {
  if (videoRef.current) {
    await videoRef.current.playAsync();
  }
};

const pause = async () => {
  if (videoRef.current) {
    await videoRef.current.pauseAsync();
  }
};

// En el render:
<Video
  ref={videoRef}
  source={{ uri: video.url }}
  style={styles.video}
  resizeMode="cover"
  shouldPlay={playerState.isPlaying}
  isLooping={false}
  onLoad={handleLoad}
  onPlaybackStatusUpdate={(status) => {
    if (status.isLoaded) {
      handleProgress({
        currentTime: status.positionMillis / 1000,
        playableDuration: status.durationMillis / 1000,
      });
    }
  }}
/>
```

### 4. Actualizar useVideoPlayer Hook

El hook en `src/hooks/useVideoPlayer.ts` necesita ser actualizado para controlar el player real:

```typescript
// Para react-native-video
type VideoPlayerRef = {
  seek: (time: number) => void;
  presentFullscreenPlayer?: () => void;
  dismissFullscreenPlayer?: () => void;
}

// Para expo-av
import { Video } from 'expo-av';
type VideoPlayerRef = Video;
```

### 5. Testing

Después de integrar el player real:

```bash
# iOS (requiere rebuild)
npm run ios

# Android (requiere rebuild)
npm run android
```

---

## 🎯 Funcionalidades del Mock Actual

El mock actual simula:

- ✅ Estados del player (loading, ready, playing, paused, error)
- ✅ Control de reproducción (play/pause)
- ✅ Solo un video activo a la vez
- ✅ Analytics events
- ✅ Thumbnail loading
- ✅ Error handling
- ✅ TTFF (Time-To-First-Frame) tracking

Lo que NO simula:
- ❌ Reproducción real de video
- ❌ Audio
- ❌ Progreso real del video
- ❌ Controles de volumen
- ❌ Fullscreen

---

## 📊 Comparación de Opciones

| Feature | Mock (Actual) | react-native-video | expo-av |
|---------|---------------|-------------------|---------|
| Setup | ✅ Listo | 🔧 Linking nativo | ✅ Fácil |
| Videos reales | ❌ | ✅ | ✅ |
| Performance | 🟢 Alta | 🟢 Alta | 🟡 Media |
| Formatos | - | HLS, DASH, MP4 | MP4, HLS |
| iOS | ✅ | ✅ | ✅ |
| Android | ✅ | ✅ | ✅ |
| Web | ✅ | ❌ | ✅ |
| DRM | ❌ | ✅ | ❌ |

---

## 🚀 Recomendación

### Para MVP / Demo / Testing:
✅ **Usar el mock actual** - Funciona perfectamente para demostrar la arquitectura y UX

### Para Producción con Expo:
✅ **Usar expo-av** - Más fácil de configurar, funciona en todas las plataformas

### Para Producción Bare React Native:
✅ **Usar react-native-video** - Mejor performance y más features

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'react-native-video'"

```bash
# Asegúrate de instalar
npm install react-native-video

# Y reconstruir
npm run ios
```

### Videos no cargan

1. Verifica la URL del video
2. Verifica conexión a internet
3. Verifica formato del video (MP4 preferido)
4. Revisa permisos en iOS (Info.plist)

### Performance Issues

1. Limita videos precargados
2. Usa formatos optimizados (HLS para streaming)
3. Implementa video caching
4. Reduce calidad en conexiones lentas

---

## 📚 Referencias

- [react-native-video docs](https://github.com/react-native-video/react-native-video)
- [expo-av docs](https://docs.expo.dev/versions/latest/sdk/av/)
- [Video formats guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)

---

**✅ El mock actual es perfecto para development y demos!**

Cuando necesites videos reales, sigue esta guía para integrar el player apropiado.



