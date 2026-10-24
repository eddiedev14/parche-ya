# ParcheYa

App móvil para crear y encontrar planes espontáneos y temporales cerca de ti. Proyecto final de Desarrollo de Software para Aplicaciones Móviles.

**Stack:** Ionic 9 + React 19 + TypeScript + Vite 8 · Tailwind CSS 4 · Firebase (Auth, Firestore, Realtime Database) · Capacitor 8.

## Empezar

```bash
npm install
cp .env.example .env   # y completa las variables VITE_FIREBASE_*
npm run dev
```

Sin `.env` la app igual carga (se muestra una advertencia en consola), pero cualquier llamada a Firebase fallará.

### Variables de entorno

| Variable                                                                                                                         | Para qué                                           |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_APP_ID` | Conexión a Firebase (la URL de RTDB depende de la región) |
| `VITE_API_URL`                                                                                                                   | Backend Node + Express (push e ImageKit)           |
| `VITE_IMAGEKIT_PUBLIC_KEY`, `VITE_IMAGEKIT_URL_ENDPOINT`                                                                         | Foto de perfil                                     |

## Scripts

| Comando                | Qué hace                         |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Servidor de desarrollo           |
| `npm run build`        | Typecheck + build de producción  |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier (80 columnas, comillas dobles, `;`) |
| `npm run format:check` | Verifica el formato sin escribir |

## Estructura

```
src/
├── assets/     # imágenes y recursos
├── features/   # dominios: auth (hoy), plans, chat...
├── pages/      # una carpeta por pantalla
├── router/     # AppRoutes.tsx y routes.ts
├── shared/     # components, firebase (config, hooks, helpers), helpers
└── theme/      # tokens de Tailwind y variables de Ionic
```

- **Firebase:** `src/shared/firebase/config.ts` exporta `auth`, `db` (Firestore) y `rtdb` (Realtime Database). Hooks genéricos: `useCollection` (Firestore), `useRTDatabase` y `useRTValue` (RTDB).
- **Rutas:** `AppRoutes.tsx` muestra la pantalla de carga mientras se resuelve la sesión, las rutas públicas sin usuario y las de usuario con sesión.
- **Diseño:** ver [`DESIGN.md`](./DESIGN.md) (guía de estilo para generar pantallas con v0).

## Android

Todavía no se generó el proyecto Android. Cuando haga falta:

```bash
npm install @capacitor/android
npm run build
npx cap add android
```

## Ramas

`main` (estable) y `develop` (integración). Cada historia de usuario se trabaja en su propia rama desde `develop`.
