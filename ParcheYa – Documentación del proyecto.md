# ParcheYa – Documentación del proyecto

*Proyecto final · Desarrollo de Software para Aplicaciones Móviles · Ionic + React + Firebase*

# 1. Descripción del Proyecto

ParcheYa es una app móvil para **crear y encontrar planes espontáneos y temporales** cerca de ti. Alguien publica algo como "Partido de fútbol 5 en la cancha del campus, en 1 hora, faltan 4", los demás lo ven en un mapa, se unen con un toque y chatean en un grupo. **Cuando el plan termina, desaparece solo**: no hay eventos viejos ni grupos de WhatsApp eternos.

La idea central es que los planes tienen **fecha de caducidad (1 a 3 horas)** y **cupo limitado**, lo que los hace distintos a una app de eventos tradicional.

## 1.1. Qué problema resuelve y para qué serviría

- **Planear con amigos es lento.** Hay que armar un grupo, esperar respuestas y casi siempre el plan se cae. ParcheYa permite publicar y que lleguen personas interesadas sin conocer a nadie.
- **Hay gente con ganas de hacer algo y sin con quién.** Estudiantes nuevos, personas que se mudaron o a quienes se les cayó un plan: jugar fútbol, ir por un café, estudiar juntos, ir a trotar.
- **Las apps de eventos están pensadas para planes grandes y con días de anticipación.** No sirven para "¿alguien quiere salir en una hora?".

# 2. Funciones

## 2.1. MVP (obligatorias)

1. **Registro e inicio de sesión** con correo y contraseña (Firebase Auth).
2. **Perfil de usuario:** nombre, bio corta y foto tomada con la cámara (se sube a ImageKit).
3. **Crear un plan:** título, categoría, descripción, hora de inicio, duración (1–3 h), cupo máximo y ubicación elegida en un mapa.
4. **Feed de planes activos** con filtros por categoría y distancia. Los filtros se recuerdan (memoria local).
5. **Mapa de planes activos** con pines. Al tocar uno se abre el detalle.
6. **Detalle del plan:** unirse o salir. Los cupos se actualizan en tiempo real y no se puede exceder el cupo.
7. **Chat grupal del plan** en tiempo real, solo para los participantes.
8. **Notificaciones push:** Alguien se unió a tu plan o mensaje nuevo en el chat.

## 2.2. Cómo cumple con los requisitos del proyecto

| Requisito | Cómo lo cumple |
| --- | --- |
| App en Ionic + React | Todas las pantallas con componentes de Ionic (`IonTabs`, `IonList`, `IonCard`, `IonModal`, `IonInput`, etc.). |
| **IonTabs** | 4 tabs: **Explorar** (feed), **Mapa**, **Mis planes** (chat incluido), **Perfil**. |
| **Firebase Auth** | Registro, login, logout, sesión persistente y rutas protegidas. |
| **Sensores** | **Cámara** (foto de perfil) y **GPS** (usar ubicación actual para crear plan) |
| **Firestore** | Datos "estáticos": usuarios, planes, reportes. |
| **Realtime Database (con sentido)** | Los cupos y participantes deben estar en tiempo real al igual que el chat de cada plan. Es información que cambia cada segundo. |
| **Push con Firebase** | Envío cuando alguien se unió a un plan creado por mí o hubo un nuevo mensaje en el chat |
| **ImageKit** | Foto de perfil |
| **Mapas / tiempo real** | Mapa con Leaflet + OpenStreetMap (gratis, sin tarjeta) |
| **Roles (UserRoutes / AdminRoutes)** | Campo `role` en el documento del usuario: `user` o `admin`. |
| **Backend (libre)** | Servidor Node + Express con `firebase-admin` (ver más abajo). |
| **Prototipo con IA** | Lovable, antes de programar. |

# 3. Modelado de Datos

## **3.1. Firestore**

- `users/{uid}`: displayName, email, bio, photoUrl, fcmToken (notificaciones)
- `plans/{planId}`: title, description, category, location {lat, lng, label}, startAt, expiresAt, capacity, creatorId, status (valores: por_empezar, en_curso, lleno, terminado).

## **3.2. Realtime Database**

- `planRooms/{planId}`: capacity, count, creatorId, participants: Array de objetos que tienen ID del participante y su nombre.
- `userPlans/{uid}/{planId}`: true
- `chats/{planId}/{messageId}`: messageId, name, photoUrl, text, timestamp

## 3.3. Backend mínimo (Node + Express + firebase-admin)

Enviar push con Firebase y firmar las subidas a ImageKit **requiere un servidor**, porque las claves privadas no pueden ir en la app. Los endpoints se verifican con el ID token de Firebase del usuario. Revisar Linknest para ver como se hizo en su momento: https://github.com/eddiedev14/linknest/tree/main/src

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/imagekit/auth` | Devuelve firma, token y expiración para subir imágenes a ImageKit. |
| POST | `/notify/user-joined` | Push al creador cuando alguien se une. |
| POST | `/notify/message` | Push a los participantes cuando hay un mensaje nuevo. |

# 4. Historias de Usuario

Las historias están ordenadas por dependencia. Cada una tiene un responsable y una semana sugerida.

| HU | Responsable | Semana | Depende de | Horas |
| --- | --- | --- | --- | --- |
| HU-01 Configuración base | Eddie | 1 | – | 3 |
| HU-02 Prototipo en Lovable y Design System | Eddie | 1 | – | 4 |
| HU-03: Registro de usuario | Eddie | 1–2 | HU-02 | 4 |
| HU-04: Login | Leiton | 2 | HU-02 | 3 |
| HU-05 Crear plan | Eddie | 2–3 | HU-04 | 4 |
| HU-06 Feed de planes y filtros | Leiton | 3 | HU-05 | 3 |
| HU-07 Detalle del plan, unirse y salir | Leiton | 3–4 | HU-06 | 4 |
| HU-08 Mapa de planes | Eddie | 4 | HU-05 | 3 |
| HU-9 Mis planes | Leiton | 4 | HU-05 | 2 |
| HU-10 Chat grupal | Eddie | 4–5 | HU-09 | 3 |
| HU-11 Notificaciones push | Leiton | 5 | HU-07, HU-10 | 4 |

## 4.1. Convenciones generales (aplican a todas las historias)

Esta sección define una sola vez lo que se repite en varias pantallas, para no redefinirlo en cada historia.

### **4.1.1. Categorías de plan (catálogo fijo, constante `CATEGORIES` en `helpers/constants.ts`)**

| id | Nombre | Ionicon | Color |
| --- | --- | --- | --- |
| `deporte` | Deporte | `football-outline` | `#22B07D` |
| `estudio` | Estudio | `book-outline` | `#5B3DF5` |
| `comida` | Comida y café | `restaurant-outline` | `#F5A524` |
| `musica` | Música | `musical-notes-outline` | `#D946A8` |
| `juegos` | Juegos | `game-controller-outline` | `#2E90FA` |
| `aire_libre` | Aire libre | `leaf-outline` | `#14B8A6` |
| `cine` | Cine y series | `film-outline` | `#475467` |
| `otro` | Otro | `ellipsis-horizontal-outline` | `#98A2B3` |

### **4.1.2. Estados de un plan (se calculan, no se guardan, excepto `cancelled`)**

| Estado | Cuándo se cumple | Color de la etiqueta |
| --- | --- | --- |
| Por empezar | `status = active` y ahora < `startAt` | Ámbar `#F5A524` |
| En curso | `status = active` y `startAt` ≤ ahora < `expiresAt` | Verde `#22B07D` |
| Lleno | `count ≥ capacity` y el plan no ha terminado | Violeta `#5B3DF5` |
| Terminado | ahora ≥ `expiresAt` | Gris `#98A2B3` |

### **4.1.3. Validación de formularios**

- Se valida al salir del campo (`onIonBlur`) y otra vez al enviar. El mensaje va debajo del campo con la propiedad `errorText` de `IonInput` o `IonTextarea`.
- Todo texto se limpia con `trim()` antes de validar y de guardar.
- Si el usuario envía con errores, no se llama al servidor y el foco va al primer campo inválido.
- Correo válido: expresión `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`, guardado en minúsculas.
- Todos los textos de la app están en español, tuteando.

## 4.2. Mapa de pantallas

Estas son **todas** las pantallas de la app. Es la lista que se genera en Lovable (HU-02) y que se implementa en Ionic. Las rutas de `/plan/...` y `/profile/...` están fuera de `IonTabs`, así que la barra inferior solo se ve en las 4 rutas `/tabs/*`.

| Ruta | Pantalla | Acceso | Estructura (de arriba a abajo) | HU |
| --- | --- | --- | --- | --- |
| `/welcome` | Bienvenida | Sin sesión, solo la primera vez | Logo 96 px centrado; H1 "Planes para ahora, con gente cerca"; texto de apoyo de 2 líneas; botón primario "Crear cuenta"; botón outline "Ya tengo cuenta" | HU-03 |
| `/login` | Iniciar sesión | Sin sesión | Logo 64 px; H2 "Hola de nuevo"; campos correo y contraseña; enlace "¿Olvidaste tu contraseña?"; botón primario "Iniciar sesión"; pie "¿No tienes cuenta? Regístrate" | HU-03 |
| `/register` | Crear cuenta | Sin sesión | Botón atrás; H2 "Crea tu cuenta"; campos nombre, correo, contraseña y confirmar contraseña; checkbox de términos; botón primario "Crear cuenta"; pie "¿Ya tienes cuenta? Inicia sesión" | HU-03 |
| `/tabs/explore` | Explorar (tab 1) | Usuario | Header "Explorar"; fila de chips de categorías con scroll horizontal; línea "Cerca de ti · 5 km" con selector; lista de `PlanCard`; FAB "+" abajo a la derecha | HU-07 |
| `/tabs/map` | Mapa (tab 2) | Usuario | Mapa a pantalla completa; chips de categoría flotantes arriba; botón flotante "Mi ubicación"; tarjeta inferior del plan seleccionado | HU-09 |
| `/tabs/my-plans` | Mis planes (tab 3) | Usuario | Header "Mis planes"; segmento Activos / Historial; lista de planes con botón de chat | HU-10 |
| `/tabs/profile` | Perfil (tab 4) | Usuario | Avatar 96 px; nombre; bio; lista con, "Notificaciones" (botón para activar) y "Cerrar sesión" | HU-05 |
| `/plan/new` | Nuevo plan | Usuario | Botón cerrar; formulario (título, categoría, descripción, inicio, duración, cupos, lugar); botón "Publicar plan" | HU-06 |
| `/plan/:planId` | Detalle del plan | Usuario | Cabecera con color de categoría; título; organizador; cuándo y dónde; descripción; mini mapa; cupos y participantes; botón de acción fijo abajo | HU-08 |
| `/plan/:planId/chat` | Chat del plan | Participantes | Header con título del plan; lista de mensajes; barra de escribir fija abajo | HU-11 |

**Elementos superpuestos (no son rutas)**

| Elemento | Dónde aparece | Contenido | HU |
| --- | --- | --- | --- |
| Selector de ubicación (modal a pantalla completa) | `/plan/new` | Botón "Usar esta ubicación" | HU-06 |
| Selector de radio (`IonActionSheet`) | `/tabs/explore` | Opciones 1, 3, 5, 10 km y "Sin límite" | HU-07 |
| Reportar plan (modal tipo hoja) | `/plan/:planId` | Motivos y botón "Enviar reporte" | HU-13 |
| Confirmaciones (`IonAlert`) | Varias | Texto, botón "Cancelar" y botón de acción | Varias |

### HU-01 · Configuración base del proyecto (Eddie)

**Historia:** Como equipo, quiero un repositorio y un proyecto Ionic organizados según la rúbrica, para que cada uno trabaje en su rama sin pisarse.

**Descripción:** Se crea el proyecto vacío pero ya navegable: estructura de carpetas, Firebase conectado, las tres familias de rutas y las 4 pestañas con pantallas de relleno. Nada de lógica de negocio todavía.

**Qué se entrega**

1. **Repositorio:** ramas `main`, `develop` : con `.env` y `node_modules`; `.env.example` con los nombres de las variables sin valores.
2. **Proyecto Ionic React en JavaScript** (archivos `.tsx`, como pide la rúbrica) con Capacitor y la plataforma Android agregada. Se instalan: `firebase`, `@capacitor/camera`, `@capacitor/geolocation`,  `@capacitor/push-notifications`, `tailwind` y la fuente `@fontsource/inter` (para que funcionen sin internet). Ionic React usa `react-router-dom` v5.
3. **Variables de entorno** en `.env`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_APP_ID`, `VITE_API_URL`, `VITE_IMAGEKIT_PUBLIC_KEY`, `VITE_IMAGEKIT_URL_ENDPOINT`.
4. **Firebase en consola:** proyecto creado; Auth con correo y contraseña activado; Firestore creado; Realtime Database creada (anotar su URL, depende de la región).
5. **Archivo `src/firebase/config.js`** que exporta `auth`, `db` (Firestore) y `rtdb` (Realtime Database).
6. **Rutas:** `AppRoutes.tsx` decide qué mostrar.
    - Cargando → pantalla con logo y `IonSpinner`.
    - Sin usuario → rutas públicas (`/welcome`, `/login`, `/register`, `/forgot-password`).
    - Usuario con rol `user` → /tabs/explore, /tabs/map, /tabs/my-plans, /tabs/profile, /plan/new, /plan/:planId, /plan/:planId/chat

### HU-02 · Prototipo en Lovable y Design System (Eddie)

**Historia:** Como equipo, quiero un prototipo visual de todas las pantallas y un sistema de diseño en código, para que la app final se vea igual al prototipo y no perdamos tiempo decidiendo estilos.

**Descripción:** Se genera en Lovable cada pantalla del Mapa de pantallas con datos de ejemplo y todos sus estados.

**Alcance del prototipo en Lovable**

- **14 pantallas** de la tabla "Mapa de pantallas", más los 3 elementos superpuestos (selector de ubicación, selector de radio, reportar plan).
- **Tamaño de lienzo:** 390 × 844 px, solo vista móvil (sin diseño de escritorio).
- **Navegación visible:** barra inferior con las 4 pestañas en las pantallas `/tabs/*`; las demás con botón atrás o cerrar arriba a la izquierda.
- **Patrones de Ionic que debe imitar:** `ion-header` con `ion-toolbar`, `ion-list` e `ion-item`, `ion-card`, `ion-chip`, `ion-segment`, `ion-fab`, `ion-modal` tipo hoja, `ion-toggle`, `ion-badge`. Nada de menús laterales ni tablas.
- **Datos de ejemplo:** 8 planes ficticios en español (uno por categoría), con distintos estados (por empezar, en curso, lleno), 5 usuarios y un chat de 8 mensajes.
- **Textos:** exactamente los de la tabla de pantallas y de las historias siguientes.

**Estados que deben verse en el prototipo (una variante por cada uno)**

| Pantalla | Estados |
| --- | --- |
| Login y registro | Normal; campo con error; enviando |
| Explorar | Con planes; cargando (skeleton); vacío; sin permiso de ubicación (banner) |
| Mapa | Con pines; pin seleccionado con tarjeta inferior |
| Mis planes | Activos con planes; vacío; historial |
| Detalle del plan | Sin unirse; unido; lleno; terminado; cancelado; soy el organizador |
| Chat | Con mensajes; vacío; plan terminado (solo lectura) |
| Nuevo plan | Normal; con errores; selector de ubicación abierto |
| Perfil y editar perfil | Norma |

**Componentes compartidos (`components/Shared`, cada uno con su `.module.scss`)**

| Componente | Props | Qué muestra |
| --- | --- | --- |
| `PlanCard` | `plan`, `count`, `distanceKm`, `onClick` | Círculo de 44 px con el ícono de la categoría; título (1 línea); fila con reloj y `formatPlanWhen`; fila con pin y lugar más distancia; cupos "3/6" con barra de progreso; avatar del organizador; `StatusBadge` arriba a la derecha |
| `CategoryChip` | `category`, `selected`, `onClick` | `IonChip` con ícono y nombre; seleccionado = fondo del color de la categoría y texto blanco |
| `StatusBadge` | `status` | Etiqueta pequeña con el color de la tabla de estados |
| `Avatar` | `url`, `name`, `size` | Foto redonda; si no hay foto, círculo de color con la inicial del nombre |
| `EmptyState` | `icon`, `title`, `text`, `actionLabel`, `onAction` | Ícono grande, título H3, texto, botón opcional |
| `PlanCardSkeleton` | – | Versión `IonSkeletonText` de la tarjeta |

### HU-03 · Bienvenida y registro de usuario (Eddie)

**Historia:** Como visitante, quiero crear una cuenta, para usar la app con mi identidad y que mis planes queden asociados a mí.

**Formulario de registro (`/register`)**

| Campo | Componente | Obligatorio | Reglas | Mensaje de error |
| --- | --- | --- | --- | --- |
| Foto de Perfil | IonInput tipo file con logo de avatar para tomarse una foto | Sí | Debe usar @capacitor/camera | Debes tener activado el permiso de camara |
| Nombre | `IonInput`, placeholder "¿Cómo te llamamos?" | Sí | 2 a 30 caracteres; solo letras, números, espacios, `.` y `-` | "Escribe tu nombre" / "Mínimo 2 caracteres" / "Máximo 30 caracteres" |
| Bio | IonInput, placeholder: “¿Cuentanos sobre ti?” | Sí | Máximo 50 caracteres | Escribe tu bio / Máximo 50 caracteres. |
| Correo | `IonInput type=email` | Sí | Formato válido | "Ese correo no es válido" |
| Contraseña | `IonInput type=password` con toggle | Sí | Mínimo 8 caracteres, al menos 1 letra y 1 número | "Mínimo 8 caracteres" / "Incluye al menos una letra y un número" |
| Confirmar contraseña | `IonInput type=password` | Sí | Igual a la contraseña | "Las contraseñas no coinciden" |
- Debe de subir la foto a ImageKit (Backend)

### HU-04: Login (Leiton) y Logout

**Historia:** Como visitante, quiero iniciar sesión, para usar la app con mi identidad y que mis planes queden asociados a mí.

**Formulario de login (`/login`)**

| Campo | Componente | Obligatorio | Reglas | Mensaje de error |
| --- | --- | --- | --- | --- |
| Correo | `IonInput type=email`, `autocomplete=email`, placeholder "tucorreo@ejemplo.com" | Sí | Formato de correo válido | "Escribe tu correo" / "Ese correo no es válido" |
| Contraseña | `IonInput type=password` con `IonInputPasswordToggle` | Sí | No vacía | "Escribe tu contraseña" |
- Hacer Logout tambien.

### HU-05 · Crear plan (Leiton)

**Historia:** Como usuario, quiero publicar un plan con lugar, hora y cupos, para que otras personas cercanas se unan.

**Descripción:** Pantalla de formulario `/plan/new`, abierta desde el botón "+" de Explorar o de Mis planes. Incluye un selector de ubicación en mapa (modal). Al publicar se guarda el plan en Firestore y se crea su sala en Realtime Database con el organizador como primer participante.

**Estructura de `/plan/new` (de arriba a abajo)**

1. `IonHeader`: botón cerrar (`close-outline`) a la izquierda; título "Nuevo plan"
2. Formulario con los campos de la tabla, en ese orden.
3. Botón primario fijo abajo "Publicar plan".

**Formulario**

| Campo | Componente | Obligatorio | Reglas | Mensaje de error |
| --- | --- | --- | --- | --- |
| Título | `IonInput`, placeholder "Ej: Partido de fútbol 5" | Sí | 5 a 60 caracteres | "Escribe un título" / "Mínimo 5 caracteres" / "Máximo 60 caracteres" |
| Categoría | Cuadrícula de 8 `CategoryChip` (una sola selección) | Sí | Una de las 8 categorías | "Elige una categoría" |
| Descripción | `IonTextarea` de 3 líneas con contador | No | Máximo 280 caracteres | "Máximo 280 caracteres" |
| Cuándo empieza | `IonSegment` con 4 opciones: "Ahora", "En 30 min", "En 1 h", "En 2 h"; por defecto "En 30 min" | Sí | Una opción | – |
| Duración | `IonSegment` con 3 opciones: "1 h", "2 h", "3 h"; por defecto "1 h" | Sí | Una opción | – |
| Cupos totales | Botones "−" y "+" con el número al centro; por defecto 4 | Sí | Entero de 2 a 20, incluyendo al organizador | Los botones no permiten salir del rango; texto de ayuda "Cuentas tú. Mínimo 2, máximo 20." |
| Nombre del lugar | `IonInput`, placeholder "Ej: Cancha del campus" | Sí | 3 a 80 caracteres | "Escribe el nombre del lugar" / "Mínimo 3 caracteres" |
| Ubicación en el mapa | Puede colocar una dirección manualmente o usar la opción de “Usar mi ubicación actual” | Sí | Debe haber coordenadas | "Elige el lugar en el mapa" |

### HU-06 · Feed de planes y filtros (Leiton)

**Historia:** Como usuario, quiero ver una lista de los planes activos cerca de mí y filtrarlos por categoría y distancia, para encontrar rápido uno que me guste.

**Descripción:** Pantalla `/tabs/explore`. Escucha los planes en tiempo real, calcula la distancia con el GPS del celular. Los datos viven en un `PlansContext` que también usará el Mapa (HU-09), para tener una sola suscripción.

**Estructura de `/tabs/explore` (de arriba a abajo)**

1. `IonHeader` con título "Explorar".
2. Fila de chips con scroll horizontal: "Todos" + las 8 categorías (`CategoryChip`). Solo uno seleccionado a la vez; por defecto "Todos".
3. Línea de texto "Cerca de ti · 5 km" con ícono `chevron-down`; al tocarla se abre un `IonActionSheet` con las opciones "1 km", "3 km", "5 km", "10 km", "Sin límite" y "Cancelar".
4. Banner amarillo (solo si el permiso de ubicación fue denegado): "Activa tu ubicación para ver distancias y planes cercanos" con botón "Activar".
5. `IonFab` abajo a la derecha con el ícono `add`, que lleva a `/plan/new`.
- **Qué muestra cada `PlanCard`:** ícono de categoría; título; "Ahora", "En 25 min" u "Hoy 6:30 p. m."; lugar y distancia ("350 m"); cupos "3/6" con barra de progreso; avatar del organizador; `StatusBadge`. Al tocarla navega a `/plan/{planId}`.
- **Cupos en vivo:** cada tarjeta usa el hook `usePlanCount(planId)`, que escucha `planRooms/{planId}/count` en Realtime Database.

**Estados de la pantalla**

| Estado | Qué se ve |
| --- | --- |
| Cargando | 3 `PlanCardSkeleton` |
| Con planes | Lista de tarjetas |
| Vacío | `EmptyState` con ícono `sparkles-outline`, título "No hay planes por aquí", texto "Sé el primero en armar uno" y botón "Crear un plan" |
| Vacío por filtros | `EmptyState` "Ningún plan coincide con tus filtros" con botón "Quitar filtros" |
| Error de carga | `EmptyState` con ícono `cloud-offline-outline` y botón "Reintentar" |

### HU-07 · Detalle del plan, unirse y salir (Leiton)

**Historia:** Como usuario, quiero ver todos los datos de un plan y unirme o salir de él, para decidir si voy y asegurar mi cupo.

**Descripción:** Pantalla `/plan/:planId`. Muestra la información del plan (Firestore) y los cupos y participantes en vivo (Realtime Database).

**Estructura de `/plan/:planId` (de arriba a abajo)**

1. `IonHeader` transparente con botón atrás. A la derecha: si no soy el organizador, ícono `flag-outline` (abre el reporte de HU-13); si soy el organizador, ícono `ellipsis-vertical` con la opción "Cancelar plan".
2. **Cabecera de color:** fondo del color de la categoría al 12 %, ícono grande de la categoría, `StatusBadge`.
3. Título (H1).
4. Fila del organizador: `Avatar` de 40 px y "Organiza {nombre}".
5. Filas de información con ícono: reloj + "Hoy 6:30 p. m. – 7:30 p. m." y debajo "En 25 min" (o "En curso"); pin + nombre del lugar y distancia.
6. Descripción (si existe; si no, se omite el bloque).
7. **Mini mapa:** Leaflet de 160 px de alto, sin interacción (sin zoom ni arrastre).
8. **Cupos:** texto "Cupos 3/6", barra de progreso. Abajo sale en forma de lista los nombres de los participantes
9. **Botón de acción fijo abajo** (ver tabla).

**Botón de acción según el estado**

| Situación | Botón |
| --- | --- |
| No estoy unido y hay cupo | "Unirme al plan" (primario) |
| Estoy unido y no soy el organizador | Dos botones: "Ir al chat" (primario, lleva a `/plan/{id}/chat`) y "Salir del plan" (outline rojo) |
| Soy el organizador | "Ir al chat" (primario) |
| El plan está lleno y no estoy unido | "Plan lleno" (deshabilitado) |
| El plan terminó | "Plan terminado" (deshabilitado); si estoy unido, "Ver chat" |
- Dependiendo si se une o no, se añade o elimina el valor en Real Time Database: `userPlans/{uid}/{planId}`: true

### HU-08 · Mapa de planes (Eddie)

**Historia:** Como usuario, quiero ver los planes activos en un mapa, para encontrar los que me quedan más cerca de un vistazo.

**Descripción:** Pestaña `/tabs/map`. Usa Leaflet con teselas de OpenStreetMap (gratis y sin tarjeta) y los mismos datos y filtro de categoría del feed, que vienen de `PlansContext`.

**Estructura de `/tabs/map`**

1. `IonHeader` con título "Mapa".
2. Mapa que ocupa todo el espacio restante, con la atribución "© OpenStreetMap contributors" visible.
3. Fila de chips de categoría flotando sobre el mapa, arriba, con scroll horizontal (mismo componente y mismo estado que Explorar).
4. Tarjeta inferior (solo cuando hay un pin seleccionado): versión compacta de `PlanCard` con título, hora, cupos y distancia, y el botón "Ver plan" que lleva a `/plan/{planId}`.

**Comportamiento del mapa**

- **Centro inicial:** la ubicación actual con zoom 15. Sin permiso de ubicación: `DEFAULT_CENTER` (constante en `helpers/constants.js`, ciudad o campus de ustedes) con zoom 13.
- **Marcador del usuario:** círculo azul de 14 px con borde blanco.
- **Pines de planes:** íconos propios con `L.divIcon` (no el marcador por defecto de Leaflet, que falla con los bundlers): gota de 32 × 40 px del color de la categoría con el ícono blanco dentro. El pin seleccionado crece a 1,25 de tamaño.
- **Tocar un pin** abre la tarjeta inferior y centra el mapa en él; **tocar un espacio vacío** la cierra.
- **Actualización:** los pines aparecen y desaparecen en vivo, igual que la lista.

### HU-09 · Mis planes (Leiton)

**Historia:** Como usuario, quiero ver los planes a los que me uní o que organicé, para entrar rápido a su detalle o a su chat.

**Descripción:** Pestaña `/tabs/my-plans`. Lee la lista de planes del usuario desde Realtime Database (`userPlans/{uid}`) y los datos de cada plan desde Firestore. Separa los planes vigentes del historial.

**Estructura de `/tabs/my-plans` (de arriba a abajo)**

1. `IonHeader` con título "Mis planes".
2. `IonSegment` con dos opciones: "Activos" (por defecto) e "Historial".
3. Lista de tarjetas. Cada una es un `PlanCard` con dos añadidos: una etiqueta "Organizador" si `creatorId` es mi uid y un botón de ícono `chatbubble-outline` a la derecha que lleva a `/plan/{planId}/chat` (en el historial, el botón se muestra solo si el chat existe). Tocar el resto de la tarjeta abre `/plan/{planId}`.
4. `IonFab` con "+" que lleva a `/plan/new`.
5. Implementar paginación

**Reglas de las listas**

| Lista | Qué incluye | Orden |
| --- | --- | --- |
| Activos | Planes con `status = active` y `expiresAt` mayor a ahora | `startAt` ascendente |
| Historial | Planes terminados o cancelados, máximo los últimos 20 | `startAt` descendente |

### HU-10 · Chat grupal en tiempo real (Eddie)

**Historia:** Como participante de un plan, quiero chatear con los demás participantes, para coordinar cómo llegar y qué llevar.

**Descripción:** Pantalla `/plan/:planId/chat`. Los mensajes viajan por Realtime Database y llegan al instante a todos los participantes. Solo quienes están dentro del plan pueden leer y escribir.

**Estructura de `/plan/:planId/chat` (de arriba a abajo)**

1. `IonHeader`: botón atrás; título con el nombre del plan (1 línea, con puntos suspensivos); subtítulo "N participantes".
2. `IonContent` con la lista de mensajes, con scroll.
    - Mensajes de otros: a la izquierda, con `Avatar` de 32 px, nombre en negrita pequeña arriba, burbuja gris clara y hora debajo.
    - Mis mensajes: a la derecha, sin avatar ni nombre, burbuja del color primario con texto blanco y hora debajo.
    - Si dos mensajes seguidos son de la misma persona y están a menos de 2 minutos, el segundo no repite avatar ni nombre.
3. `IonFooter` fijo con un `IonTextarea` que crece de 1 a 4 líneas (placeholder "Escribe un mensaje") y un botón circular de enviar (`send`).
4. Si el plan terminó o fue cancelado, el pie se reemplaza por una barra gris "Este plan terminó. El chat es de solo lectura".

**Campo del mensaje**

| Campo | Componente | Obligatorio | Reglas | Comportamiento |
| --- | --- | --- | --- | --- |
| Mensaje | `IonTextarea` con `autoGrow` | Sí | 1 a 500 caracteres después del `trim()` | El botón de enviar está deshabilitado si está vacío o supera 500; después de enviar se limpia el campo y el teclado se mantiene abierto |

Se permite un mensaje por segundo como máximo (el botón se bloquea 1 s después de enviar). Si el texto pasa de 450 caracteres aparece un contador "460/500".

**Datos**

### HU-11 · Notificaciones push (Leiton)

**Historia:** Como usuario, quiero recibir avisos de planes nuevos, de personas que se unen y de mensajes, para enterarme aunque no tenga la app abierta.

**Descripción:** Se integra Firebase Cloud Messaging con `@capacitor/push-notifications`. La app registra el token del dispositivo en el perfil del usuario y el backend (HU-04) envía las notificaciones usando `firebase-admin`.

**Cuándo se pide el permiso:** la primera vez que el usuario llega a `/tabs/explore,` aparece un `IonAlert` "¿Quieres que te avisemos de planes y mensajes nuevos?" con "Ahora no" y "Sí, avisarme". Solo con "Sí" se pide el permiso del sistema (en Android 13 o superior es `POST_NOTIFICATIONS`).

**Registro del token**

1. `PushNotifications.register()` y, en el evento `registration`, se guarda `token.value` en `users/{uid}.fcmToken`.
2. Se crea el canal Android `default` con importancia alta.
3. Al cerrar sesión se pone `fcmToken: null` para que el siguiente usuario del mismo celular no reciba avisos ajenos.

**Endpoints del backend**

| Endpoint | Quién puede llamarlo | Qué hace el servidor | Notificación |
| --- | --- | --- | --- |
| `POST /notify/user-joined` `{ planId }` | Un participante del plan | Verifica en RTDB que quien llama está en `participants`; envía al organizador | Título "{nombre} se unió a tu plan"; texto "{título} · {count}/{capacity}"; datos `{ route: "/plan/{id}" }` |
| `POST /notify/message` `{ planId, text }` | Un participante del plan | Verifica participación; envía a los demás participantes con token; ignora si el mismo remitente ya envió una en ese plan hace menos de 30 s | Título con el nombre del plan; texto "{nombre}: {primeros 80 caracteres}"; datos `{ route: "/plan/{id}/chat" }` |

# 5. Design System

### Colores (Definir para Tailwind)

| Rol | Nombre | Hex | Uso |
| --- | --- | --- | --- |
| Primario | Naranja Parche | `#E8481F` | Botones principales, pines del mapa, tab activa |
| Secundario | Violeta Noche | `#5B3DF5` | Acciones secundarias, enlaces, chips activos |
| Acento | Amarillo Chispa | `#FFC83D` | Etiquetas de "quedan pocos cupos", destacados |
| Fondo | Crema | `#FFF8F2` | Fondo de pantallas |
| Superficie | Blanco | `#FFFFFF` | Cards, modales, inputs |
| Texto principal | Tinta | `#1F1B2E` | Títulos y cuerpo |
| Texto secundario | Gris violáceo | `#6B6680` | Subtítulos, fechas, placeholders |
| Borde | Lila claro | `#E8E2EE` | Divisores y bordes de inputs |
| Éxito | Verde | `#22B07D` | Unido, plan confirmado |
| Error | Rojo | `#E5484D` | Errores, reportar, eliminar |
| Advertencia | Ámbar | `#F5A524` | Plan por empezar |

> El texto sobre el color primario es **blanco, en 16 px y peso 600** para mantener buena legibilidad.
> 

### Tipografía

- **Títulos:** Poppins (Google Fonts), pesos 600 y 700.
- **Cuerpo y botones:** Inter (Google Fonts), pesos 400, 500 y 600.
    
    
    | Elemento | Fuente | Tamaño | Alto de línea | Peso |
    | --- | --- | --- | --- | --- |
    | Heading 1 | Inter | 28 px | 34 px | 700 |
    | Heading 2 | Inter | 24 px | 30 px | 700 |
    | Heading 3 | Inter | 20 px | 26 px | 600 |
    | Heading 4 | Inter | 18 px | 24 px | 600 |
    | Body grande | Inter | 16 px | 24 px | 400 |
    | Body (por defecto) | Inter | 14 px | 20 px | 400 |
    | Botón | Inter | 16 px | 20 px | 600 |
    | Caption / etiquetas | Inter | 12 px | 16 px | 500 |
    | Label de tab | Inter | 11 px | 14 px | 500 |

# 6. Logo

![ParcheYa Logo.jpeg](ParcheYa%20%E2%80%93%20Documentaci%C3%B3n%20del%20proyecto/ParcheYa_Logo.jpeg)