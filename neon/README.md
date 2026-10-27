# NEON ARCADE: Ultimate Challenge (PWA)
Tres modos: Neon Kart Racing, Campus Explorer y Orbital Defense. Sin dependencias; funciona sin conexión tras la primera carga.

## Ejecutar localmente
`python3 -m http.server 8080` en esta carpeta y abre http://localhost:8080 (los módulos ES y el Service Worker no funcionan con file://).

## Publicar (HTTPS)
Sube la carpeta completa a GitHub Pages, Netlify, Cloudflare Pages o cualquier hosting estático con HTTPS. Las rutas son relativas.

## Instalar
- **Android (Chrome):** botón «Instalar aplicación» o menú ⋮ › Instalar aplicación.
- **iPhone/iPad:** abre en Safari › Compartir › Añadir a pantalla de inicio.
- Es una PWA, no un APK. Para un APK: Capacitor (`npm i @capacitor/cli`, `npx cap add android`, Android Studio y firma con keystore propio).

## Controles
Teclado: flechas/WASD, Espacio (turbo / salto / disparo), P pausa. Táctil: botones en pantalla (multitáctil).

## Problemas comunes
- No aparece «Instalar»: requiere HTTPS y una primera carga completa.
- Tras actualizar, cambia `C` en `sw.js` (versión de caché) y recarga.
- Datos guardados en LocalStorage (`neon_v1`); «Borrar datos» los restablece.
