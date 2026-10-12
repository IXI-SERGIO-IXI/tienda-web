// worker de la web. las páginas salen directamente de dist/, aquí solo llega lo que no es
// un fichero:
//   POST /api/tiun-sale           -> comprueba la venta con tiun y la avisa en discord
//   POST /webhook/discord/<bot>   -> reenvía los webhooks de discord a mi backend
//
// secretos (npx wrangler secret put NOMBRE): DISCORD_WEBHOOK_URL, TIUN_API_KEY, BACKEND_URL

// discord rechaza (403) las peticiones sin user-agent
const UA = 'TiendaWorker/1.0';

const SALE_COLOR = 0x45e0cf;

// bots de discord cuyos webhooks se reenvían al backend. cualquier otro nombre da 404
const DISCORD_HOOKS = ['bot-1', 'bot-2', 'bot-3', 'bot-4'];

// tiun solo devuelve el id del producto, así que el nombre y el precio para el aviso los
// saco de aquí. tiene que coincidir con src/config.ts
const TIUN_PRODUCTS = {
  'p-live-xxxxxa1': { name: 'OPCIÓN A · COMUNIDAD 1', price: 'PRECIO' },
  'p-live-xxxxxa2': { name: 'OPCIÓN A · COMUNIDAD 2', price: 'PRECIO' },
  'p-live-xxxxxa3': { name: 'OPCIÓN A · AMBAS', price: 'PRECIO' },
  'p-live-xxxxxb1': { name: 'OPCIÓN B · COMUNIDAD 1', price: 'PRECIO' },
  'p-live-xxxxxb2': { name: 'OPCIÓN B · COMUNIDAD 2', price: 'PRECIO' },
  'p-live-xxxxxb3': { name: 'OPCIÓN B · AMBAS', price: 'PRECIO' },
  'p-live-xxxxxc1': { name: 'OPCIÓN C · DURACIÓN 1', price: 'PRECIO' },
  'p-live-xxxxxc2': { name: 'OPCIÓN C · DURACIÓN 2', price: 'PRECIO' },
  'p-live-xxxxxc3': { name: 'OPCIÓN C · DURACIÓN 3', price: 'PRECIO' },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/tiun-sale') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      return handleTiunSale(request, env);
    }

    // Mando los webhooks a mi dominio y desde aquí los reenvío tal cual (el backend comprueba la 
    // firma de discord, por eso no se toca ni el cuerpo ni las cabeceras)
    if (url.pathname.startsWith('/webhook/discord/')) {
      const hook = url.pathname.slice('/webhook/discord/'.length);
      if (!DISCORD_HOOKS.includes(hook)) return new Response('Not found', { status: 404 });
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      if (!env.BACKEND_URL) return new Response('Not configured', { status: 503 });
      return fetch(`${env.BACKEND_URL}/webhook/${hook}`, {
        method: 'POST',
        headers: request.headers,
        body: request.body,
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleTiunSale(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad payload', { status: 400 });
  }
  const { token, productId } = body ?? {};
  if (typeof token !== 'string' || typeof productId !== 'string' || !/^p-live-[a-z0-9]+$/.test(productId)) {
    return new Response('Bad payload', { status: 400 });
  }
  // los productos que creo a mano para un pedido (/pay) no están en la lista
  const product = TIUN_PRODUCTS[productId] ?? { name: 'Custom order (/pay link)', price: null };

  if (!env.TIUN_API_KEY || !env.DISCORD_WEBHOOK_URL) {
    return new Response('Not configured', { status: 503 });
  }

  // lo que manda el navegador no es de fiar. le paso el token a tiun con mi api key y es tiun
  // quien me dice quién es el cliente y qué productos tiene
  let verified;
  try {
    const resp = await fetch('https://api.tiun.live/live_api/s2s/v1/users/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TIUN-API-KEY': env.TIUN_API_KEY,
        'User-Agent': UA,
      },
      body: JSON.stringify({ userVerificationToken: token }),
    });
    if (!resp.ok) return new Response(`Verification failed: ${resp.status}`, { status: 401 });
    verified = await resp.json();
  } catch {
    return new Response('tiun unreachable', { status: 502 });
  }
  const user = verified?.userInfo;
  if (!verified?.isAuthenticated || !user?.productAccess?.includes(productId)) {
    return new Response('Not purchased', { status: 403 });
  }

  // el token vale 5 minutos y se podría reenviar: apunto la venta en la caché 24h para no
  // avisar dos veces.
  const origin = new URL(request.url).origin;
  const seen = new Request(`${origin}/__tiun-sale/${encodeURIComponent(user.userId)}/${productId}`);
  if (await caches.default.match(seen)) return new Response('duplicate', { status: 200 });

  const now = Math.floor(Date.now() / 1000);
  const box = container(
    SALE_COLOR,
    '## 💰 NEW SALE — TIUN',
    [
      `**${product.name}**`,
      product.price ? `**Price:** \`${product.price}\`` : null,
      `**Customer:** ${user.email}`,
      `**When:** <t:${now}:f> (<t:${now}:R>)`,
    ],
    `${productId} · ${user.userId}`,
    'tiun',
  );
  // 32768 = mensaje con components v2. allowed_mentions vacío
  const message = { flags: 32768, components: [box], allowed_mentions: { parse: [] } };
  const discord = await fetch(`${env.DISCORD_WEBHOOK_URL}?with_components=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify(message),
  });
  if (!discord.ok) return new Response(`Discord relay failed: ${discord.status}`, { status: 502 });

  await caches.default.put(seen, new Response('1', { headers: { 'Cache-Control': 'max-age=86400' } }));
  return new Response('ok', { status: 200 });
}

// tarjeta de discord: caja (17) con título, separadores (14) y líneas de texto (10)
function container(accent, title, bodyLines, footer, source) {
  const body = bodyLines.filter(Boolean).map((content) => ({ type: 10, content }));
  return {
    type: 17,
    accent_color: accent,
    components: [
      { type: 10, content: title },
      { type: 14 },
      ...body,
      { type: 14 },
      { type: 10, content: `-# ${source} · ${footer}` },
    ],
  };
}
