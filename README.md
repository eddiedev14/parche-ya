<p align="center">
  <img src="./assets/README%20banner.jpeg" alt="ParcheYa Banner" width="100%"/>
</p>

<h1 align="center">ParcheYa</h1>

<p align="center">
  <em>Conéctate y arma tu parche: planes espontáneos y temporales cerca de ti.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-Producción-green?style=flat-square" />
  <img src="https://img.shields.io/badge/mobile-Ionic%20%2B%20Capacitor-3880FF?style=flat-square&logo=ionic" />
  <img src="https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/backend-Firebase-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/database-Firestore%20%2B%20Realtime%20DB-orange?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/styling-Tailwind%20CSS-38BDF8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/platform-Android-3DDC84?style=flat-square&logo=android" />
</p>

---

# Descarga la APK

Instala ParcheYa en tu celular Android:

> **Enlace de descarga: pendiente.**

---

# Mockups

Visualiza los mockups de ParcheYa en Figma:

- Diseño: https://www.figma.com/design/oOGsUhNSeTGzgIgduAJ5hy/ParcheYa?node-id=0-1&t=xBHfiuh9JSkaJIhX-1
- Simulación: https://www.figma.com/proto/oOGsUhNSeTGzgIgduAJ5hy/ParcheYa?node-id=1-2&p=f&viewport=274%2C382%2C0.2&t=tLwp2qEBR2oXEXJH-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A2&page-id=0%3A1

---

# Prototipo con Lovable

Antes de escribir una sola línea de la aplicación, el prototipo de ParcheYa se diseñó con ayuda de inteligencia artificial usando **Lovable**. Ese prototipo sirvió para validar el flujo completo (crear un plan, verlo en el feed y en el mapa, unirse y chatear) y para fijar la identidad visual que después se documentó en [`DESIGN.md`](./DESIGN.md) y se construyó sobre Ionic + React.

- Prototipo: https://parche-ya.lovable.app/

---

## Descripción General

**ParcheYa** es una aplicación móvil para crear y encontrar planes espontáneos y temporales cerca del usuario. Alguien publica un plan (por ejemplo, "Partido de fútbol 5 en la cancha del campus, en 1 hora, faltan 4 cupos"), las demás personas lo ven en un mapa o en un feed, se unen con un toque y conversan en un chat grupal del plan.

A diferencia de una app de eventos tradicional, un plan en ParcheYa tiene fecha de caducidad y cupo limitado: cuando termina, desaparece solo, sin dejar eventos viejos ni grupos de chat eternos.

El proyecto nació como trabajo final de **Desarrollo de Software para Plataformas Móviles**, con el propósito de demostrar el uso aplicado de **sensores del dispositivo** (cámara y GPS) y de los **dos modelos de base de datos de Firebase** (Firestore y Realtime Database) en un producto móvil funcional construido con Ionic y React.

---

## Propósito del Sistema

Organizar un plan de último momento hoy implica armar un grupo de WhatsApp, esperar respuestas y rezar para que nadie se baje. Es una fricción pensada para eventos planeados, no para "quiero jugar fútbol dentro de una hora".

ParcheYa está pensado para estudiantes nuevos, personas que acaban de mudarse de ciudad o a quienes se les canceló un plan y buscan compañía para jugar, tomar un café, estudiar juntos o salir a trotar. El objetivo es que **publicar, descubrir y unirse a un plan tome segundos**, en una única plataforma.

---

## Alcance del Sistema

**Incluido en el sistema:**

- Autenticación completa (registro, inicio y cierre de sesión) con Firebase Authentication.
- Perfil de usuario con nombre, bio corta y foto de perfil tomada con la cámara y subida a ImageKit.
- Creación de planes con título, categoría, descripción, hora de inicio, duración (1 a 3 h), cupo máximo (2 a 20) y ubicación elegida en un mapa o con el GPS.
- Feed de planes activos con filtros por categoría y distancia, recordados entre sesiones.
- Mapa de planes activos con pines por categoría; al tocar uno se abre su detalle.
- Detalle del plan con opción de unirse o salir; cupos y participantes se actualizan en tiempo real sin permitir exceder el cupo.
- Chat grupal en tiempo real por plan, visible solo para sus participantes.
- Notificaciones push cuando alguien se une a un plan propio o llega un mensaje nuevo.
- Sección "Mis planes" con los planes activos del usuario y su historial.

**Fuera del alcance actual:**

- Versión web (el sistema es exclusivamente móvil, empaquetado como APK de Android).
- Calificaciones o reseñas de usuarios tras finalizar un plan.
- Funcionalidades sociales (seguir personas, lista de amigos).
- Panel de administración para moderación de contenido o reportes.
- Edición de un plan ya publicado (solo se permite cancelarlo).

---

## Funcionalidades Principales

| Módulo                     | Descripción                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Autenticación**          | Registro con foto desde la cámara, login y logout con protección de rutas        |
| **Crear plan**             | Formulario con categoría, horario, duración, cupos y ubicación (mapa o GPS)      |
| **Explorar**               | Feed de planes activos con filtros por categoría y distancia, cupos en vivo      |
| **Mapa**                   | Pines por categoría, centrado en la ubicación del usuario y tarjeta de resumen   |
| **Detalle del plan**       | Información completa, mini mapa, participantes, unirse y salir con control de cupo |
| **Chat grupal**            | Mensajes en tiempo real, exclusivos para participantes; solo lectura al terminar |
| **Mis planes**             | Planes activos e historial (últimos 20), con acceso directo al chat              |
| **Notificaciones push**    | Avisos de nuevos participantes y de mensajes nuevos con Firebase Cloud Messaging |

---

## Stack Tecnológico

| Capa                         | Tecnología                                                  |
| ---------------------------- | ----------------------------------------------------------- |
| **Frontend**                 | Ionic React 9 + React 19 + TypeScript 5.9                   |
| **Build Tool**               | Vite 8                                                      |
| **Estilos**                  | Tailwind CSS 4                                              |
| **Routing**                  | React Router DOM v6                                         |
| **Empaquetado nativo**       | Capacitor 8 (Android)                                       |
| **Autenticación**            | Firebase Authentication                                     |
| **Base de Datos Principal**  | Cloud Firestore (NoSQL)                                     |
| **Base de Datos en Tiempo Real** | Firebase Realtime Database                              |
| **Sensores**                 | `@capacitor/camera`, `@capacitor/geolocation`               |
| **Notificaciones**           | Firebase Cloud Messaging (`@capacitor/push-notifications`)  |
| **Mapas**                    | Leaflet + React-Leaflet + OpenStreetMap                     |
| **Imágenes de perfil**       | ImageKit                                                    |
| **Backend**                  | Funciones serverless en Vercel + `firebase-admin`           |
| **Iconos**                   | Ionicons                                                    |

---

## Arquitectura y Tiempo Real

ParcheYa usa **dos bases de datos de Firebase** de forma complementaria, cada una para el tipo de dato que mejor maneja, y dos **sensores** del dispositivo.

### Cloud Firestore: datos que no cambian cada segundo

Almacena los documentos `users/{uid}` (perfil, bio, foto, token de notificaciones) y `plans/{planId}` (título, descripción, categoría, ubicación, horarios, cupo y estado). El acceso se centraliza en el hook genérico `useCollection`, que expone operaciones CRUD y una suscripción con `onSnapshot`: cuando cambia la colección de planes, el feed y el mapa se refrescan solos.

La consulta de planes activos usa un único `where` sobre `expiresAt` para no requerir un índice compuesto; el filtro por `status` se aplica del lado del cliente.

### Firebase Realtime Database: datos de alta frecuencia

Guarda los cupos y participantes de cada plan (`planRooms/{planId}`), la relación entre un usuario y sus planes (`userPlans/{uid}/{planId}`) y los mensajes del chat (`chats/{planId}/{messageId}`). El acceso se encapsula en el hook `useRTDatabase`, equivalente a `useCollection` pero sobre el árbol JSON de RTDB.

**Control de cupos con transacciones.** Dos personas pueden presionar "Unirme" casi al mismo tiempo por el último cupo. Por eso `usePlanMembership` no hace una actualización simple sino un `runTransaction` sobre `planRooms/{planId}`: si el plan ya se llenó o el usuario ya estaba dentro, la escritura se aborta; si llegan dos solicitudes simultáneas, Firebase reejecuta la segunda con el valor ya actualizado y la rechaza. Sin transacción, el plan quedaría sobrecupado.

### Sensores

- **Cámara** (`@capacitor/camera`): el componente `AvatarPicker` toma la foto de perfil directamente con la cámara (no permite galería). La foto se sube a ImageKit con una firma temporal pedida al backend. Si el permiso se niega, se muestra "Debes tener activado el permiso de cámara"; si se cancela la captura, no se muestra error.
- **GPS** (`@capacitor/geolocation`): al crear un plan ofrece "usar mi ubicación actual", y en el feed y el mapa calcula la distancia a cada plan para ordenarlos y filtrarlos por cercanía. Si el permiso se niega, la app no se bloquea: muestra un banner y deja de calcular distancias.

---

## Backend

El backend vive en `backend/` y está compuesto por **funciones serverless de Vercel**. Cada archivo de `backend/api/` exporta un handler HTTP independiente que Vercel expone como endpoint con la misma ruta del archivo.

Existe porque dos operaciones no pueden resolverse solo desde el cliente: **firmar las subidas a ImageKit** y **enviar notificaciones push**. Ambas requieren llaves privadas (de ImageKit y de Firebase Admin) que nunca deben viajar dentro de la app.

**Seguridad.** Todos los endpoints exigen el header `Authorization: Bearer <idToken>` con el ID Token de Firebase del usuario, lo verifican con `auth.verifyIdToken` y solo entonces ejecutan la lógica. El módulo `firebaseAdmin.ts` centraliza la inicialización de `auth`, `db` (Firestore) y `rtdb` (Realtime Database) reutilizando una sola instancia entre invocaciones.

| Método | Endpoint                    | Para qué sirve                                                                                                                                                                                                      |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/upload-avatar`        | Recibe la foto de perfil (JPEG, máximo 2 MB), verifica que sea una imagen real y la sube a ImageKit con la llave privada. El servidor fija el nombre (`{uid}.jpg`) y la carpeta, así que cada usuario solo puede escribir su propia foto. |
| `GET`  | `/api/imagekit-image`       | Sirve las fotos de perfil: valida que la ruta pertenezca a `/avatars/...`, firma la URL con la llave privada (vigente 60 segundos) y devuelve la imagen redimensionada y comprimida.                                  |
| `POST` | `/api/notify-user-joined`   | Envía el push "{nombre} se unió a tu plan" al organizador. Valida que quien llama sea parte del plan (leyendo `planRooms/{planId}`) y limpia el token si Firebase indica que ya no es válido.                         |
| `POST` | `/api/notify-message`       | Envía el push de un mensaje nuevo a los demás participantes (nunca al remitente). Valida la participación y limita a una notificación cada 30 segundos por remitente y plan, controlado con una transacción en RTDB. |

### Variables de entorno del backend (Vercel)

| Variable                                                                         | Para qué                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_DATABASE_URL` | Credenciales de `firebase-admin`  |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`          | Subida y entrega de fotos de perfil                |
| `ALLOWED_ORIGINS`                                                                | Orígenes adicionales permitidos (separados por coma) |

---

## Estructura del Proyecto

```
src/
├── assets/                    # Imágenes y recursos
├── features/
│   ├── auth/                  # Registro, login, logout, contexto de sesión
│   ├── chat/                  # ChatComposer, MessageBubble, useChat
│   ├── notifications/         # Permiso, registro del token FCM y avisos push
│   └── plans/                 # Crear, explorar, mapa, detalle y membresía
├── pages/                     # Una carpeta por pantalla (explore, map, my-plans...)
├── router/                    # AppRoutes.tsx y routes.ts
├── shared/
│   ├── api/                   # Cliente HTTP hacia el backend
│   ├── components/            # Componentes reutilizables (PlanCard, Avatar...)
│   ├── firebase/              # config, useCollection, useRTDatabase, helpers
│   └── helpers/ hooks/ types/
└── theme/                     # Tokens de Tailwind y variables de Ionic

backend/
└── api/                       # Funciones serverless (Vercel)
```

---

## Instalación y Configuración

### Prerrequisitos

- Node.js >= 18
- Un proyecto de [Firebase](https://firebase.google.com/) con Authentication, Firestore y Realtime Database
- Una cuenta de [ImageKit](https://imagekit.io/)
- Android Studio (solo para generar la APK)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/eddiedev14/parche-ya.git
cd parche-ya
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

```bash
cp .env.example .env
```

| Variable                                                                                                                               | Para qué                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_APP_ID` | Conexión a Firebase (la URL de RTDB depende de la región) |
| `VITE_API_URL`                                                                                                                         | URL del backend desplegado en Vercel                      |
| `VITE_IMAGEKIT_URL_ENDPOINT`                                                                                                           | Foto de perfil                                            |

**4. Ejecutar en desarrollo**

```bash
npm run dev
```

**5. Compilar para producción**

```bash
npm run build
```

**6. Generar la APK (Android)**

```bash
npx cap sync android
npx cap open android   # Build > Build APK(s) desde Android Studio
```

### Scripts

| Comando                | Qué hace                                      |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                        |
| `npm run build`        | Typecheck + build de producción               |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Prettier (80 columnas, comillas dobles, `;`)  |
| `npm run format:check` | Verifica el formato sin escribir              |
| `npm run icons`        | Genera los íconos y splash con Capacitor Assets |

---

## Modelo de Datos (Firebase)

| Colección / Nodo           | Almacenamiento        | Descripción                                                   |
| -------------------------- | --------------------- | ------------------------------------------------------------- |
| `users/{uid}`              | Firestore             | Perfil del usuario, bio, foto y `fcmToken`                    |
| `plans/{planId}`           | Firestore             | Datos del plan: categoría, ubicación, horarios, cupo y estado |
| `planRooms/{planId}`       | **Realtime Database** | Cupos y participantes del plan en vivo                        |
| `userPlans/{uid}/{planId}` | **Realtime Database** | Relación entre un usuario y sus planes                        |
| `chats/{planId}/{messageId}` | **Realtime Database** | Mensajes del chat grupal                                    |

---

## Historias de Usuario Implementadas

| ID     | Historia                              | Desarrollador    |
| ------ | ------------------------------------- | ---------------- |
| HU-01  | Configuración base del proyecto       | Eddie            |
| HU-02  | Bienvenida y registro de usuario      | Eddie            |
| HU-03  | Login y logout                        | Leiton           |
| HU-04  | Crear plan                            | Eddie            |
| HU-05  | Feed de planes y filtros              | Leiton           |
| HU-06  | Detalle del plan, unirse y salir      | Leiton           |
| HU-07  | Mapa de planes                        | Eddie            |
| HU-08  | Mis planes                            | Leiton           |
| HU-09  | Chat grupal en tiempo real            | Eddie            |
| HU-10  | Notificaciones push                   | Leiton           |

El detalle de cada historia y sus criterios de aceptación está en el [Informe Final](./docs/Informe%20Final%20Parche%20Ya.pdf).

---

## Objetivos del Proyecto

- Reducir la fricción de organizar planes espontáneos a unos pocos toques.
- Demostrar el uso aplicado de sensores móviles (cámara y GPS) en un producto real.
- Combinar Firestore y Realtime Database, cada uno donde mejor encaja.
- Garantizar la consistencia de cupos con transacciones, incluso con solicitudes simultáneas.
- Mantener la clave privada fuera de la app mediante un backend serverless.

---

## Ramas

`main` (estable) y `develop` (integración). Cada historia de usuario se trabaja en su propia rama desde `develop`.

---

## Autores

<p align="left">
  <a href="https://github.com/eddiedev14">
    <img src="https://img.shields.io/badge/Developer-eddiedev14-blue?style=flat-square&logo=github" />
  </a>
  &nbsp;
  <a href="https://github.com/leiton05">
    <img src="https://img.shields.io/badge/Developer-leiton05-green?style=flat-square&logo=github" />
  </a>
</p>

Eddie Santiago Delgado Campo y Sebastián Leiton Goyes. Docente: Jonathan López Londoño.

---

## Licencia

Este proyecto es de uso académico universitario. Todos los derechos reservados a sus autores.
