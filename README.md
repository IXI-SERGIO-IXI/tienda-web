# Tienda web

Web de una tienda de bots de Discord hecha con Astro y desplegada en Cloudflare. Tiene cuatro
páginas de producto, una página de promociones con pago online y un Worker que avisa en un
canal de Discord cuando entra una venta.

Los textos que se ven en la web son de ejemplo.

## Tecnologías

- Astro 7 y TypeScript
- Tailwind CSS 4
- Cloudflare Workers
- SDK de pagos de tiun
- Webhooks de Discord

## Qué hace

- La web es estática: las páginas se generan al hacer build. Los datos (planes, precios, ids
  de producto) están en `src/config.ts` y las páginas los recorren para pintarlos.
- En la página de promociones cada botón abre el checkout de su producto. El pago se completa
  en otra página y al volver la web se recarga, así que el producto elegido se guarda en
  `localStorage` para saber qué se ha comprado.
- Cuando se confirma el pago, la web manda al Worker un token de verificación del cliente. El
  Worker no se fía de lo que llega del navegador: valida el token contra la API de tiun con
  una API key y comprueba que el cliente tiene ese producto antes de publicar el aviso.
- Para no avisar dos veces de la misma venta, el Worker guarda una marca en la caché de
  Cloudflare durante 24 horas.
- `/pay?p=<id>` es un enlace de pago directo para pedidos que se cierran a mano.
- El Worker también reenvía los webhooks de las apps de Discord al backend.

## Estructura

```
src/
  pages/          una página por fichero
  components/     menú, pie, tarjeta de precio y pago
  layouts/        plantilla común
  styles/         colores y fuentes
  config.ts       datos de la web
worker/
  index.js        Worker de Cloudflare
public/           icono y redirecciones
wrangler.jsonc    configuración del Worker
```

## En local

Necesita Node 22.12 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

La web queda en `http://localhost:4321`.

## Despliegue

Los secretos del Worker se guardan en Cloudflare:

```bash
npx wrangler secret put TIUN_API_KEY
npx wrangler secret put DISCORD_WEBHOOK_URL
npx wrangler secret put BACKEND_URL
```

Y para publicar:

```bash
npm run build
npx wrangler deploy
```

También se puede conectar el repositorio a Cloudflare para que se despliegue solo con cada
push a `main`.
