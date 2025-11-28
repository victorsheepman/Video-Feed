# 🚀 Guía Rápida - Video Feed App

## ⚡ Inicio Rápido (3 pasos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar la aplicación
```bash
# Iniciar el servidor Expo
npm start

# O directamente en iOS/Android
npm run ios     # Para iOS
npm run android # Para Android
```

### 3. ¡Listo! 🎉
La aplicación se abrirá mostrando el feed vertical de videos.

---

## 📱 Cómo Usar la App

### Navegación Principal

**Scroll Vertical:**
- Desliza hacia arriba/abajo para navegar entre posts
- Al 80% de visibilidad, el post se activa automáticamente
- El primer video del post activo se reproduce automáticamente

**Scroll Horizontal:**
- Desliza izquierda/derecha dentro de un post
- El video visible se reproduce, los otros se pausan
- Indicadores de paginación muestran tu posición

**Interacciones:**
- Tap en avatar/nombre → Acción de perfil (console.log por ahora)
- Tap en ❤️ → Like (visual por ahora)
- Tap en 💬 → Comentarios (visual por ahora)
- Tap en 📤 → Compartir (visual por ahora)
- Tap en 🔖 → Guardar (visual por ahora)

**Pull to Refresh:**
- Desliza hacia abajo en la parte superior
- Recarga el feed (simulado por ahora)

---

## 🎮 Features Principales

### ✨ Lo que funciona ahora:

1. **Feed Vertical Optimizado**
   - 200 posts reales con videos de Google GTV y Blender
   - Scroll ultra fluido (60fps)
   - Solo 3 posts en memoria a la vez

2. **Carrusel Horizontal**
   - 3-5 videos por post
   - Paginación automática
   - Solo el video visible se reproduce

3. **Reproducción Inteligente**
   - ✅ Solo un video suena a la vez
   - ✅ Pausa automática al salir de viewport
   - ✅ Autoplay del video visible

4. **Prefetching**
   - Precarga del siguiente post
   - Precarga del siguiente video
   - Indicador ⚡ en el header cuando está cargando

5. **Analytics**
   - Todos los eventos se registran en consola
   - Métricas de reproducción
   - Time-to-First-Frame (TTFF)

---

## 🔍 Testing de Performance

### Ver métricas en consola:

```bash
# Ejecutar con logs
npm start

# Buscar en consola:
# ▶️  = Inicio de reproducción
# ⏸️  = Pausa
# 📱 = Cambio de post activo
# 🎬 = Cambio de video activo
# 🔄 = Prefetching
# ⏱️  = Métricas de tiempo
```

### Pruebas recomendadas:

1. **Scroll rápido**
   - Hacer scroll rápido arriba/abajo
   - Verificar que no hay stuttering
   - FPS debería mantenerse en 60

2. **Cambio de videos**
   - Navegar entre videos en el carrusel
   - Solo el visible debería reproducirse
   - Verificar indicadores de paginación

3. **Memoria**
   - Navegar por 20-30 posts
   - Verificar que no crece indefinidamente
   - Use React DevTools o Xcode Instruments

4. **Prefetching**
   - Ver el indicador ⚡ en el header
   - Verificar logs de prefetch en consola
   - Videos deberían cargar más rápido

---

## 🎨 Personalización

### Cambiar configuración de performance:

Edita `src/constants/config.ts`:

```typescript
// Performance más agresiva (usa menos memoria)
FLASH_LIST_WINDOW_SIZE: 2  // Default: 3
MAX_TO_RENDER_PER_BATCH: 1  // Default: 2

// Performance más suave (usa más memoria)
FLASH_LIST_WINDOW_SIZE: 5   // Default: 3
MAX_TO_RENDER_PER_BATCH: 3  // Default: 2
```

### Cambiar comportamiento de videos:

```typescript
// src/constants/config.ts
VIDEO_CONFIG = {
  AUTOPLAY: true,              // Auto-reproducir
  MUTED_BY_DEFAULT: false,     // Con audio
  LOOP_VIDEOS: true,           // Loop infinito
  MAX_ACTIVE_PLAYERS: 3,       // Máx players en memoria
}
```

### Cambiar prefetching:

```typescript
// src/constants/config.ts
PREFETCH_CONFIG = {
  enabled: true,
  nextPost: true,              // Prefetch siguiente post
  nextVideo: true,             // Prefetch siguiente video
  prefetchDistance: 1,         // Distancia (1 = siguiente)
  maxConcurrent: 2,            // Máx descargas paralelas
}
```

---

## 🐛 Troubleshooting

### Problemas comunes:

**❌ Videos no cargan**
```bash
# Verificar conexión a internet
# Los videos son remotos (Google Cloud Storage)

# Limpiar cache
npm start -- --clear
```

**❌ App muy lenta**
```bash
# Verificar que estás en modo development
# El modo production es mucho más rápido

# Para testing de performance real:
npm run ios --configuration Release
```

**❌ Múltiples videos sonando**
```bash
# Verificar logs en consola
# Buscar mensajes de: "Pausing other video"

# Si persiste, reportar issue con logs
```

**❌ Errores de TypeScript**
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install

# Limpiar cache de TypeScript
rm -rf .expo
npm start -- --clear
```

---

## 📊 Data Mock

### Posts disponibles:

- **Total:** 200 posts
- **Videos por post:** 3-5 videos
- **Duración:** 15s a 15 minutos
- **Fuente:** Google GTV + Blender Open Movies
- **Calidad:** HD (1080p mayoría)

### Personalizar cantidad de posts:

```typescript
// src/data/mockPosts.ts

// Reducir a 50 posts (para testing)
export const mockPosts: Post[] = Array.from({ length: 50 }, ...)

// Aumentar a 500 posts (stress test)
export const mockPosts: Post[] = Array.from({ length: 500 }, ...)
```

---

## 🎯 Próximos Pasos

### Para extender la app:

1. **Integrar Backend Real**
   - Reemplazar `mockPosts` con fetch a API
   - Implementar paginación infinita
   - Agregar refresh real

2. **Agregar Navegación**
   - Pantalla de perfil de usuario
   - Pantalla de comentarios
   - Pantalla de configuración

3. **Features Sociales**
   - Sistema de likes funcional
   - Sistema de comentarios
   - Seguir/dejar de seguir usuarios
   - Notificaciones

4. **Optimizaciones Avanzadas**
   - Migrar a FlashList
   - Cache local de videos
   - Modo offline
   - Compresión de videos

---

## 📚 Documentación Completa

Para información más detallada:

- 📖 [README.md](./README.md) - Documentación principal
- 📄 [PASO_2_COMPLETE.md](./PASO_2_COMPLETE.md) - Tipos y Constantes
- 📄 [PASO_3_COMPLETE.md](./PASO_3_COMPLETE.md) - Custom Hooks
- 📄 [PASO_4_COMPLETE.md](./PASO_4_COMPLETE.md) - Componentes
- 📄 [PASO_5_COMPLETE.md](./PASO_5_COMPLETE.md) - Pantalla de Feed

---

## 💡 Tips Pro

### Para desarrollo:

```bash
# Abrir DevTools
# iOS: Cmd + D
# Android: Cmd + M

# Ver logs filtrados
npm start | grep "▶️"  # Solo eventos de play

# Performance profiling
# Use React DevTools Profiler
# O Xcode Instruments (iOS)
```

### Para debugging:

```typescript
// Habilitar más logs
// src/constants/config.ts
ANALYTICS_CONFIG = {
  LOG_TO_CONSOLE: true,  // Ya habilitado
}

// Ver estadísticas de prefetch
import { getPrefetchStats } from '@/hooks/usePrefetch';
console.log(getPrefetchStats());

// Ver conteo de videos activos
import { getActiveVideoCount } from '@/hooks/useVideoPlayer';
console.log('Active videos:', getActiveVideoCount());
```

---

**¿Listo para empezar? Ejecuta `npm start` y disfruta! 🚀**

