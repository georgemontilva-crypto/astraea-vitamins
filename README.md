# Astraea Vitamins

Tienda DTC para 37 SKUs (26 core + 5 On-the-Go + 6 gummies) con sistema de
verificación de lote por QR fijo → página Lab Tests → selector de batch.

Stack: **React + Vite + tRPC + Drizzle ORM + MySQL**, desplegado en **Railway**,
media en **Cloudflare R2**, correo transaccional con **Resend** — mismo patrón
que gss-smokeshop / brighterdayslabs / roots-extract.

## Estructura

```
design-reference/     ← todo lo que mandó el cliente, tal cual (fuente de verdad de diseño/copy)
  mockups/             HTML clickeables: storefront, lab-tests, brand-identity, labels, etc.
  labels/               Astraea_All_37_Labels.pdf — las 37 etiquetas completas (Supplement Facts reales)
  docs/                 Build Brief, PDP Copy Deck, Marketing Guide, COMPONENT-SPEC.md

data/
  pdp-copy.json          Copy deck de las 37 SKUs extraído del xlsx (headline, blurb, why-this-form, free-from)

server/                 Express + tRPC + Drizzle
  src/db/schema.ts        products, batches (COA), orders, waitlist
  src/db/seed.ts          siembra los 37 productos desde data/pdp-copy.json
  src/router/index.ts      products.list / products.byHandle / labTests.batchesForProduct / waitlist.join

client/                 Vite + React + React Router
  src/styles/tokens.css    tokens de diseño copiados literal del COMPONENT-SPEC.md
  src/pages/               Home, Shop, ProductDetail, LabTests (esqueletos conectados a tRPC)
```

- **`server/src/trpc.ts`** define tres tipos de procedure: `publicProcedure`,
  `protectedProcedure` (requiere sesión) y `adminProcedure` (requiere
  `role: "admin"`). La sesión es un JWT en cookie httpOnly (`astraea_session`),
  no hay tokens en localStorage.
- **Panel admin** en `/admin` (login en `/admin/login`) — gestión de stock/precio
  por producto y el flujo de publicar/despublicar batches. Un batch reprobado
  no se puede publicar (queda forzado a nivel de mutation, no solo de UI).
  No está enlazado desde la nav pública a propósito.
- **Cuentas de cliente** en `/login`, `/register`, `/account` — hoy solo
  perfil + logout; el historial de pedidos está vacío porque no hay checkout
  conectado a un proveedor de pago todavía.

## Por qué está así

- **`design-reference/` no se toca.** Es el material del cliente tal cual llegó.
  Cada página real se construye mirando `mockups/storefront.html` (home/shop/PDP)
  y `mockups/lab-tests.html` (la lógica del selector producto→batch, que ya
  viene funcionando en JS vanilla ahí — portarla 1:1 al componente React).
- **El esquema de `batches`** implementa la arquitectura de QR fijo descrita en
  el Build Brief (hoja "Batch-COA System"): el QR nunca codifica un lote, solo
  el `handle` del producto; la página Lab Tests filtra y muestra el más reciente.
  `published` empieza en `false` a propósito — un lote no debe verse hasta pasar
  el SOP de publicación (hoja "Batch Publishing SOP").
- **Los Supplement Facts reales** de las 37 etiquetas están en el PDF
  (`design-reference/labels/Astraea_All_37_Labels.pdf`), no en una hoja de cálculo
  estructurada. Hay que transcribirlos a `supplementFacts` (json) en el seed —
  quedó como placeholder por ahora.

## Pendiente del lado del cliente (no estaba en los archivos)

- Precios (one-time / subscribe) — el copy deck no trae precios.
- Stock inicial por SKU.
- Fotografía de producto real (las cards usan el SVG placeholder de botella del prototipo).
- Nombre del laboratorio acreditado y datos reales de batch/lote (todo lo que hay es placeholder "[ACCREDITED LAB NAME]").
- QR real por producto (hoy es un rectángulo de relleno en el mockup).
- Dirección del distribuidor para el label (`[Street Address]`).

## Setup local

```bash
cp .env.example .env       # completar DATABASE_URL con el MySQL de Railway y JWT_SECRET (openssl rand -base64 48)
npm install
npm run db:generate        # genera migraciones drizzle desde schema.ts
npm run db:migrate
npm run db:seed 2>/dev/null || tsx server/src/db/seed.ts
ADMIN_EMAIL=vos@astraeavitamins.com ADMIN_PASSWORD=cambiala123 tsx server/src/db/seed-admin.ts
npm run dev                 # server :3000 + vite :5173 (proxy /api -> :3000)
```

## Deploy en Railway

1. Crear proyecto en Railway, añadir plugin **MySQL** (esto inyecta `DATABASE_URL`).
2. Conectar este repo/rama como servicio.
3. Variables de entorno: copiar las de `.env.example` (R2, Resend, y **`JWT_SECRET`**
   — generalo con `openssl rand -base64 48`, no lo dejes vacío) en el servicio.
4. Build: Nixpacks detecta `npm run build` / `npm run start` automáticamente
   (ver `railway.json`). Build command real: `npm run build`, start: `npm run start`.
5. Correr migraciones una vez desplegado: `railway run npm run db:migrate`, luego
   `railway run npm run db:seed` para cargar los 37 productos + un puñado de
   batches de muestra (los mismos datos placeholder que ya trae `storefront.html`,
   para que Lab Tests sea demostrable de una).
6. Crear el primer admin: `railway run bash -c "ADMIN_EMAIL=vos@astraeavitamins.com ADMIN_PASSWORD=elegiUnaBuena tsx server/src/db/seed-admin.ts"`,
   después entrás en `/admin/login`.

## Siguiente paso recomendado

Este scaffold deja el proyecto **desplegable** (rutas, DB, tRPC funcionando) pero
las páginas son esqueletos. El trabajo pesado de portar pixel-a-pixel el prototipo
(`design-reference/mockups/storefront.html` y `lab-tests.html`) a componentes React
es ideal para hacerlo con Claude Code localmente, iterando página por página,
igual que en gss-smokeshop.
