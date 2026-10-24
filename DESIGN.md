# DESIGN.md · ParcheYa

Guía de estilo y contrato de diseño para generar las pantallas de ParcheYa con v0 (o cualquier herramienta de UI). Todo lo que se genere debe poder pegarse en este repo y funcionar sin adaptar estilos.

> Los valores marcados con **(propuesto)** no están en la documentación del proyecto; son decisiones de este archivo para que el resultado sea consistente. Todo lo demás viene de `ParcheYa – Documentación del proyecto.md`.

---

## 1. Qué es ParcheYa

App móvil para **crear y encontrar planes espontáneos y temporales** cerca de ti. Alguien publica "Partido de fútbol 5 en la cancha del campus, en 1 hora, faltan 4", los demás lo ven en feed y mapa, se unen con un toque y chatean en grupo. Los planes duran **1 a 3 horas**, tienen **cupo limitado** y **desaparecen solos**.

Tono visual: **cálido, juvenil, directo**. Fondo crema, un naranja protagonista, violeta como acento secundario. Nada corporativo ni frío. Tarjetas limpias, mucho aire, jerarquía clara.

Tono de texto: **español, tuteando** ("Crea tu cuenta", "¿Olvidaste tu contraseña?"). Frases cortas. Sin jerga técnica.

---

## 2. Reglas duras para v0

1. **Solo vista móvil.** Lienzo de **390 × 844 px**. Sin diseño de escritorio, sin breakpoints `md:`/`lg:`.
2. **Componentes de Ionic React** (`@ionic/react`) para toda la estructura: `IonPage`, `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent`, `IonList`, `IonItem`, `IonCard`, `IonChip`, `IonSegment`, `IonFab`, `IonModal` (tipo hoja), `IonToggle`, `IonBadge`, `IonInput`, `IonTextarea`, `IonButton`, `IonActionSheet`, `IonAlert`, `IonSkeletonText`, `IonSpinner`, `IonTabs`. **No uses shadcn/ui, Radix, MUI ni HTML crudo para controles** (botones, inputs, listas, modales).
3. **Tailwind v4 para layout y tokens.** Espaciado, flex/grid, color de texto y fondo con utilidades. Las utilidades usan `!important` (configurado así a propósito para ganarle a los estilos de Ionic).
4. **React + TypeScript (`.tsx`), plano.** Nada de Next.js: sin `next/link`, `next/image`, `next/navigation`, ni `"use client"`. Navegación con `useNavigate` de `react-router-dom` (v6).
5. **Sin menús laterales (`IonMenu`), sin tablas, sin hamburguesas.**
6. **Solo modo claro.** No generes variantes dark; `dark:` está prohibido.
7. **Íconos: `ionicons`** (`import { addOutline } from "ionicons/icons"` + `<IonIcon icon={addOutline} />`). Estilo `-outline` por defecto. No lucide, no heroicons, no emojis como íconos.
8. **No inventes colores.** Solo los tokens de la sección 3. Para categorías, solo los 8 colores de la sección 7.
9. **Textos exactos.** Donde la sección 8 da un texto entre comillas, úsalo tal cual.
10. **Datos de ejemplo en español**, ficticios y verosímiles (nombres colombianos/latinos, lugares de campus y ciudad). Mocks locales dentro del archivo; no llames a Firebase desde un diseño.
11. **Áreas táctiles ≥ 44 × 44 px.** Contraste AA mínimo.

---

## 3. Design tokens

Ya están definidos en `src/theme/tailwind.css` (`@theme`) y `src/theme/variables.css` (variables de Ionic). **No los redefinas**; úsalos.

### 3.1 Colores

| Rol | Nombre | Hex | Utilidad Tailwind | Prop `color` de Ionic | Uso |
| --- | --- | --- | --- | --- | --- |
| Primario | Naranja Parche | `#E8481F` | `bg-primary` `text-primary` `border-primary` | `primary` | Botones principales, pines del mapa, tab activa |
| Secundario | Violeta Noche | `#5B3DF5` | `bg-secondary` `text-secondary` | `secondary` | Acciones secundarias, enlaces, chips activos |
| Acento | Amarillo Chispa | `#FFC83D` | `bg-accent` `text-accent` | `tertiary` | Etiquetas "quedan pocos cupos", destacados |
| Fondo | Crema | `#FFF8F2` | `bg-cream` | (fondo por defecto) | Fondo de pantallas |
| Superficie | Blanco | `#FFFFFF` | `bg-surface` | – | Cards, modales, inputs |
| Texto principal | Tinta | `#1F1B2E` | `text-ink` | – | Títulos y cuerpo |
| Texto secundario | Gris violáceo | `#6B6680` | `text-muted` | – | Subtítulos, fechas, placeholders |
| Borde | Lila claro | `#E8E2EE` | `border-line` `bg-line` | – | Divisores y bordes de inputs |
| Éxito | Verde | `#22B07D` | `text-success` `bg-success` | `success` | Unido, plan confirmado |
| Error | Rojo | `#E5484D` | `text-danger` `bg-danger` | `danger` | Errores, reportar, eliminar |
| Advertencia | Ámbar | `#F5A524` | `text-warning` `bg-warning` | `warning` | Plan por empezar |

Reglas de uso:

- **Texto sobre el color primario: blanco, 16 px, peso 600** (ya lo hace `<IonButton>` por defecto).
- Fondos translúcidos de color (cabecera de plan, badges suaves): usa el color de la categoría/estado **al 12 %** (`bg-primary/12`, o `style={{ backgroundColor: color + "1F" }}` para colores dinámicos).
- Sobre amarillo y ámbar el texto es **Tinta**, no blanco.
- Un solo CTA primario por pantalla. El resto, `fill="outline"` o `fill="clear"`.

### 3.2 Tipografía

Fuentes locales (ya cargadas en `main.tsx`): **Poppins** 600/700 para títulos y **Inter** 400/500/600 para cuerpo y botones.

> Nota: la documentación dice "Títulos: Poppins" pero su tabla lista Inter en los headings. Se resolvió con **Poppins en H1–H4** (la viñeta explícita) e Inter para todo lo demás. Cambiar es una línea: `--font-heading` en `src/theme/tailwind.css`.

| Elemento | Clase Tailwind | Fuente | Tamaño / alto | Peso |
| --- | --- | --- | --- | --- |
| Heading 1 | `font-heading text-h1` | Poppins | 28 / 34 | 700 |
| Heading 2 | `font-heading text-h2` | Poppins | 24 / 30 | 700 |
| Heading 3 | `font-heading text-h3` | Poppins | 20 / 26 | 600 |
| Heading 4 | `font-heading text-h4` | Poppins | 18 / 24 | 600 |
| Body grande | `text-body-lg` | Inter | 16 / 24 | 400 |
| Body (por defecto) | `text-body` | Inter | 14 / 20 | 400 |
| Botón | `text-button` | Inter | 16 / 20 | 600 |
| Caption / etiquetas | `text-caption` | Inter | 12 / 16 | 500 |
| Label de tab | `text-tab` | Inter | 11 / 14 | 500 |

`text-h1`…`text-tab` ya traen tamaño, alto de línea y peso. Para títulos agrega siempre `font-heading` y un color (`text-ink`).

### 3.3 Forma, espaciado y elevación **(propuesto)**

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-card` | 16 px | Cards, hojas modales (esquinas superiores), banners |
| `rounded-control` | 12 px | Botones, inputs, segmentos |
| `rounded-full` | 999 px | Chips, avatares, badges, FAB, botón de enviar |
| Gutter de pantalla | 16 px (`px-4`) | Margen lateral del contenido |
| Separación entre bloques | 16 px (`gap-4`) / 24 px (`gap-6`) entre secciones | |
| Padding interno de card | 16 px (`p-4`) | |
| Elevación de card | `shadow-sm` + `border border-line` | Sin sombras pesadas |
| Elevación flotante (FAB, tarjeta inferior del mapa, barra de chat) | `shadow-lg` | |

Sin degradados, sin glassmorphism, sin bordes de color grueso. La personalidad viene del color y la tipografía, no del adorno.

---

## 4. Patrones de Ionic que se deben imitar

- **Header:** `IonHeader` > `IonToolbar` > `IonTitle`. Botón atrás/cerrar a la izquierda en `IonButtons slot="start"` (`arrow-back-outline` / `close-outline`). Fondo crema, sin borde inferior pesado.
- **Contenido:** siempre dentro de `IonContent fullscreen`. Páginas con formulario o lista usan `className="ion-padding"` o `px-4`.
- **Listas:** `IonList` + `IonItem` (con `lines="none"` si cada item es una card). Para tarjetas de plan usa `IonCard` o `div` con `rounded-card bg-surface border border-line`.
- **Filtros:** `IonChip` en fila horizontal con scroll (`flex gap-2 overflow-x-auto`).
- **Alternar vistas:** `IonSegment` + `IonSegmentButton` (Activos / Historial, "Ahora / En 30 min / …").
- **Acción flotante:** `IonFab vertical="bottom" horizontal="end" slot="fixed"` con `IonFabButton` y `addOutline`. Si hay tabs, súbelo para no tapar la barra.
- **Modales:** `IonModal` tipo hoja (`breakpoints`/`initialBreakpoint`) para reportar; a pantalla completa para el selector de ubicación.
- **Selectores y confirmaciones:** `IonActionSheet` (radio de búsqueda), `IonAlert` (confirmaciones y permiso de notificaciones).
- **Carga:** `IonSkeletonText animated`. Spinner solo para pantalla de carga inicial (`IonSpinner name="crescent"`).
- **Barra de tabs:** `IonTabs` + `IonTabBar slot="bottom"`; solo en las 4 rutas `/tabs/*`.

Íconos de las 4 tabs **(propuesto)**: Explorar `compass-outline`, Mapa `map-outline`, Mis planes `calendar-outline`, Perfil `person-outline`. Tab activa en color primario.

---

## 5. Formularios

- Campos con `IonInput` / `IonTextarea` usando `label` + `labelPlacement="stacked"` y `fill="outline"` (o la variante que mejor se lea sobre crema), fondo blanco, borde `line`.
- **Mensaje de error debajo del campo** con la prop `errorText` (el campo se marca con `className="ion-invalid ion-touched"` en el estado de error).
- Contraseñas con `IonInputPasswordToggle` dentro del `IonInput type="password"`.
- Correo: `type="email"`, `autocomplete="email"`, placeholder "tucorreo@ejemplo.com".
- Estado "enviando": botón con `IonSpinner name="crescent"` y deshabilitado.
- Estados que deben verse en el diseño: **normal**, **campo con error**, **enviando**.

Validaciones y mensajes (útiles para los estados de error del diseño):

| Campo | Regla | Mensajes |
| --- | --- | --- |
| Nombre | 2–30 caracteres; letras, números, espacios, `.` y `-` | "Escribe tu nombre" / "Mínimo 2 caracteres" / "Máximo 30 caracteres" |
| Bio | Máx. 50 caracteres | "Escribe tu bio" / "Máximo 50 caracteres." |
| Correo | Formato válido | "Escribe tu correo" / "Ese correo no es válido" |
| Contraseña | Mín. 8, 1 letra y 1 número | "Mínimo 8 caracteres" / "Incluye al menos una letra y un número" |
| Confirmar contraseña | Igual a la contraseña | "Las contraseñas no coinciden" |
| Título del plan | 5–60 caracteres | "Escribe un título" / "Mínimo 5 caracteres" / "Máximo 60 caracteres" |
| Descripción | Opcional, máx. 280, con contador | "Máximo 280 caracteres" |
| Nombre del lugar | 3–80 caracteres | "Escribe el nombre del lugar" / "Mínimo 3 caracteres" |
| Ubicación | Debe haber coordenadas | "Elige el lugar en el mapa" |
| Categoría | Una de las 8 | "Elige una categoría" |

---

## 6. Componentes compartidos

Van en `src/shared/components/`, un archivo `.tsx` por componente, export con nombre. Props en una `interface Props`. Estilos con Tailwind (sin CSS aparte).

**Ya implementados:** `PlanCard`, `CategoryChip`, `StatusBadge`, `Avatar`, `EmptyState`, `PlanCardSkeleton`, `Logo` y `LoadingScreen`. Reutilízalos; no los redibujes. Se importan desde `src/shared/components`. Tipos del plan en `src/shared/types/plan.types.ts`; `getPlanStatus`, `formatPlanWhen` y `formatDistance` en `src/shared/helpers/plan.helper.ts`.

| Componente | Props | Qué muestra |
| --- | --- | --- |
| `PlanCard` | `plan`, `count`, `distanceKm`, `onClick` | Círculo de **44 px** con el ícono de la categoría (fondo = color de categoría al 12 %, ícono en el color); título (1 línea, truncado); fila reloj + cuándo ("Ahora", "En 25 min", "Hoy 6:30 p. m."); fila pin + lugar y distancia ("350 m"); cupos "3/6" con barra de progreso; `Avatar` del organizador; `StatusBadge` arriba a la derecha |
| `CategoryChip` | `category`, `selected`, `onClick` | `IonChip` con ícono y nombre. Seleccionado = fondo del color de la categoría y texto blanco; no seleccionado = fondo blanco, borde `line`, texto Tinta |
| `StatusBadge` | `status` | Etiqueta pequeña (`text-caption`, `rounded-full`) con el color de la tabla de estados (sección 7.2) |
| `Avatar` | `url`, `name`, `size` | Foto redonda; sin foto, círculo de color con la inicial del nombre |
| `EmptyState` | `icon`, `title`, `text`, `actionLabel`, `onAction` | Ícono grande, título H3, texto, botón opcional |
| `PlanCardSkeleton` | – | Versión `IonSkeletonText` de la tarjeta |
| `Logo` | `size` | Ya existe (`Logo.tsx`). Úsalo, no dibujes otro |

Barra de progreso de cupos: pista `bg-line` de 6 px de alto, relleno `bg-primary` (o `bg-secondary` cuando está lleno), `rounded-full`. Quedan pocos cupos (≤ 2): etiqueta `bg-accent text-ink` "Quedan N".

---

## 7. Catálogos

### 7.1 Categorías (constante `CATEGORIES` en `src/shared/helpers/constants.ts`)

Importa de ahí; no las repitas en cada pantalla.

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

### 7.2 Estados de un plan (constante `PLAN_STATUSES`)

| Estado | Etiqueta | Color |
| --- | --- | --- |
| `por_empezar` | Por empezar | Ámbar `#F5A524` |
| `en_curso` | En curso | Verde `#22B07D` |
| `lleno` | Lleno | Violeta `#5B3DF5` |
| `terminado` | Terminado | Gris `#98A2B3` |

Un plan cancelado se muestra con etiqueta gris "Cancelado" y, en el detalle, un aviso rojo.

---

## 8. Mapa de pantallas

Son **todas** las pantallas (14 + 3 superpuestos). Las rutas `/plan/...` están **fuera** de `IonTabs`: la barra inferior solo aparece en `/tabs/*`.

| Ruta | Pantalla | Archivo | Estructura (de arriba a abajo) |
| --- | --- | --- | --- |
| `/welcome` | Bienvenida | `pages/welcome/WelcomePage.tsx` | Logo 96 px centrado; H1 "Planes para ahora, con gente cerca"; texto de apoyo de 2 líneas; botón primario "Registrarse"; botón outline "Iniciar sesión" |
| `/login` | Iniciar sesión | `pages/login/LoginPage.tsx` | Logo 64 px; H2 "Hola de nuevo"; campos correo y contraseña; enlace "¿Olvidaste tu contraseña?"; botón primario "Iniciar sesión"; pie "¿No tienes cuenta? Regístrate" |
| `/register` | Crear cuenta | `pages/register/RegisterPage.tsx` | Botón atrás; H2 "Crea tu cuenta"; foto de perfil (avatar con cámara), nombre, bio, correo, contraseña y confirmar contraseña; checkbox de términos; botón primario "Crear cuenta"; pie "¿Ya tienes cuenta? Inicia sesión" |
| `/tabs/explore` | Explorar (tab 1) | `pages/explore/ExplorePage.tsx` | Header "Explorar"; fila de chips ("Todos" + 8 categorías) con scroll horizontal; línea "Cerca de ti · 5 km" con `chevron-down` (abre `IonActionSheet`); banner amarillo si no hay permiso de ubicación; lista de `PlanCard`; FAB "+" abajo a la derecha |
| `/tabs/map` | Mapa (tab 2) | `pages/map/MapPage.tsx` | Header "Mapa"; mapa a pantalla completa (usa un placeholder gris con pines dibujados; el mapa real es Leaflet y se integra aparte); chips de categoría flotando arriba; botón flotante "Mi ubicación"; tarjeta inferior del plan seleccionado con botón "Ver plan"; atribución "© OpenStreetMap contributors" visible |
| `/tabs/my-plans` | Mis planes (tab 3) | `pages/my-plans/MyPlansPage.tsx` | Header "Mis planes"; `IonSegment` Activos / Historial; lista de `PlanCard` con etiqueta "Organizador" cuando aplica y botón `chatbubble-outline` a la derecha; FAB "+" |
| `/tabs/profile` | Perfil (tab 4) | `pages/profile/ProfilePage.tsx` | Avatar 96 px; nombre; bio; lista con "Notificaciones" (botón para activar) y "Cerrar sesión" (en rojo) |
| `/plan/new` | Nuevo plan | `pages/new-plan/NewPlanPage.tsx` | Botón cerrar (`close-outline`) a la izquierda y título "Nuevo plan"; formulario; botón primario fijo abajo "Publicar plan" |
| `/plan/:planId` | Detalle del plan | `pages/plan-detail/PlanDetailPage.tsx` | Header transparente con atrás (y `flag-outline` si no soy el organizador, o `ellipsis-vertical` con "Cancelar plan" si lo soy); cabecera con color de categoría al 12 %, ícono grande y `StatusBadge`; título H1; organizador ("Organiza {nombre}") con `Avatar` 40 px; filas con ícono: reloj + "Hoy 6:30 p. m. – 7:30 p. m." y debajo "En 25 min" o "En curso", pin + lugar y distancia; descripción (se omite si no hay); mini mapa de 160 px sin interacción; cupos "Cupos 3/6" con barra y lista de participantes; botón(es) de acción fijo(s) abajo |
| `/plan/:planId/chat` | Chat del plan | `pages/plan-chat/PlanChatPage.tsx` | Header: atrás, título del plan (1 línea, elipsis) y subtítulo "N participantes"; lista de mensajes; barra de escribir fija abajo |

### 8.1 Formulario de Nuevo plan (orden exacto)

1. **Título** · placeholder "Ej: Partido de fútbol 5".
2. **Categoría** · cuadrícula de 8 `CategoryChip`, una sola selección.
3. **Descripción** · `IonTextarea` de 3 líneas con contador "0/280" (opcional).
4. **Cuándo empieza** · `IonSegment` "Ahora" · "En 30 min" · "En 1 h" · "En 2 h" (por defecto "En 30 min").
5. **Duración** · `IonSegment` "1 h" · "2 h" · "3 h" (por defecto "1 h").
6. **Cupos totales** · botones "−" y "+" con el número al centro (por defecto 4, rango 2–20); ayuda: "Cuentas tú. Mínimo 2, máximo 20."
7. **Nombre del lugar** · placeholder "Ej: Cancha del campus".
8. **Ubicación en el mapa** · botón "Usar mi ubicación actual" y opción de elegir en el mapa (abre el selector a pantalla completa con botón "Usar esta ubicación").
9. Botón primario fijo "Publicar plan".

### 8.2 Botón de acción del detalle según el estado

| Situación | Botón |
| --- | --- |
| No estoy unido y hay cupo | "Unirme al plan" (primario) |
| Estoy unido y no soy el organizador | Dos botones: "Ir al chat" (primario) y "Salir del plan" (outline rojo) |
| Soy el organizador | "Ir al chat" (primario) |
| Plan lleno y no estoy unido | "Plan lleno" (deshabilitado) |
| Plan terminado | "Plan terminado" (deshabilitado); si estoy unido, "Ver chat" |

### 8.3 Chat

- Mensajes de otros: a la izquierda, `Avatar` de 32 px, nombre en negrita pequeña arriba, burbuja gris clara (`bg-line` suave) y hora debajo.
- Mis mensajes: a la derecha, sin avatar ni nombre, burbuja `bg-primary` con texto blanco y hora debajo.
- Dos mensajes seguidos de la misma persona a menos de 2 minutos: el segundo no repite avatar ni nombre.
- Pie fijo: `IonTextarea` con `autoGrow` (1 a 4 líneas, placeholder "Escribe un mensaje") y botón circular de enviar (`send`). Contador "460/500" cuando pasa de 450 caracteres.
- Plan terminado o cancelado: el pie se reemplaza por una barra gris "Este plan terminó. El chat es de solo lectura".

### 8.4 Elementos superpuestos (no son rutas)

| Elemento | Dónde | Contenido |
| --- | --- | --- |
| Selector de ubicación (modal a pantalla completa) | `/plan/new` | Mapa + botón "Usar esta ubicación" |
| Selector de radio (`IonActionSheet`) | `/tabs/explore` | "1 km", "3 km", "5 km", "10 km", "Sin límite", "Cancelar" |
| Reportar plan (modal tipo hoja) | `/plan/:planId` | Motivos (lista de opciones) y botón "Enviar reporte" |
| Confirmaciones (`IonAlert`) | Varias | Texto, botón "Cancelar" y botón de acción. Permiso de notificaciones: "¿Quieres que te avisemos de planes y mensajes nuevos?" con "Ahora no" y "Sí, avisarme" |

---

## 9. Estados que cada pantalla debe poder mostrar

Genera una variante por cada estado (por ejemplo con una prop `state` o un mock aparte).

| Pantalla | Estados |
| --- | --- |
| Login y registro | Normal; campo con error; enviando |
| Explorar | Con planes; cargando (3 `PlanCardSkeleton`); vacío; vacío por filtros; error de carga; sin permiso de ubicación (banner) |
| Mapa | Con pines; pin seleccionado con tarjeta inferior |
| Mis planes | Activos con planes; vacío; historial |
| Detalle del plan | Sin unirse; unido; lleno; terminado; cancelado; soy el organizador |
| Chat | Con mensajes; vacío; plan terminado (solo lectura) |
| Nuevo plan | Normal; con errores; selector de ubicación abierto |
| Perfil | Normal |

Textos de los estados vacíos de Explorar:

- **Vacío:** ícono `sparkles-outline`, título "No hay planes por aquí", texto "Sé el primero en armar uno", botón "Crear un plan".
- **Vacío por filtros:** título "Ningún plan coincide con tus filtros", botón "Quitar filtros".
- **Error de carga:** ícono `cloud-offline-outline`, botón "Reintentar".
- **Banner de ubicación:** "Activa tu ubicación para ver distancias y planes cercanos" con botón "Activar".

---

## 10. Datos de ejemplo

Para que todas las pantallas se vean reales:

- **8 planes ficticios**, uno por categoría, con estados variados (por empezar, en curso, lleno).
- **5 usuarios** con nombres en español; algunos con foto y otros sin ella (para ver el `Avatar` con inicial).
- **1 chat de 8 mensajes** que incluya mensajes propios, de otros y dos seguidos de la misma persona.

Ejemplo de plan: `{ title: "Partido de fútbol 5", category: "deporte", location: "Cancha del campus", startAt: "en 25 min", capacity: 6, count: 3 }`.

---

## 11. Dónde va el código generado

Estructura por **features / shared / pages** dentro de `src/`:

```
src/
├── assets/            # imágenes y recursos estáticos (logo.svg)
├── features/          # lógica y UI propia de un dominio: auth, plans, chat...
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── context/
│       ├── types/
│       └── index.ts   # barrel: lo único que se importa desde fuera
├── pages/             # una carpeta por pantalla: pages/<nombre>/<Nombre>Page.tsx
│   └── index.ts       # re-exporta todas las pages
├── router/            # AppRoutes.tsx y routes.ts (rutas como constantes)
├── shared/            # lo reutilizable entre features
│   ├── components/    # PlanCard, CategoryChip, StatusBadge, Avatar, EmptyState, Logo...
│   ├── firebase/      # config.ts, hooks (useCollection, useRTDatabase), helpers, types
│   └── helpers/       # constants.ts (CATEGORIES, PLAN_STATUSES...)
└── theme/             # tailwind.css (tokens) y variables.css (variables de Ionic)
```

Convenciones:

- **Pages:** `export default` de un componente `XxxPage` que devuelve `IonPage` > (`IonHeader`) > `IonContent`. Una page solo compone; la lógica y los datos viven en hooks de `features/`.
- **Componentes compartidos:** `export const PlanCard = ...` (export con nombre) en `shared/components/PlanCard.tsx`.
- **Rutas:** nunca escribas paths a mano; usa `ROUTES` de `src/router/routes.ts` (`navigate(ROUTES.plan(id))`).
- **Imports relativos** (no hay alias `@/`).
- **Mocks de diseño:** si una pantalla necesita datos de ejemplo, déjalos en el mismo archivo o en `features/<feature>/mocks.ts`, claramente nombrados `MOCK_*`, para poder reemplazarlos por Firestore/RTDB después.
- **Sin lógica de Firebase en el diseño.** Los hooks genéricos (`useCollection`, `useRTDatabase`, `useRTValue`) se conectan después.

---

## 12. Logo

Placeholder en `src/assets/images/logo.svg` (gota/pin blanco sobre cuadrado naranja con una chispa amarilla). Se consume con `<Logo size={96} />`. Tamaños: **96 px** en Bienvenida y pantalla de carga, **64 px** en Login. Cuando exista el logo definitivo, basta con reemplazar ese archivo.

---

## 13. Checklist antes de entregar una pantalla

- [ ] Se ve bien a 390 × 844 y no hay scroll horizontal.
- [ ] Solo `@ionic/react` para estructura y controles; íconos de `ionicons`.
- [ ] Solo colores y tipografías de los tokens (sin hex sueltos, salvo colores de categoría).
- [ ] Textos exactos de la sección 8 y en español tuteando.
- [ ] Un único CTA primario; áreas táctiles ≥ 44 px.
- [ ] Todos los estados de la sección 9 están representados.
- [ ] Sin Next.js, sin shadcn, sin modo oscuro, sin menú lateral ni tablas.
- [ ] El archivo está en la carpeta correcta y exportado desde `pages/index.ts` (si es una page).
