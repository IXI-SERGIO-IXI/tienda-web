// datos de la web: textos, precios e ids. las páginas solo los pintan

export const SITE = {
  name: "MARCA",
  description: "DESCRIPCIÓN DE LA WEB",
  // si empieza por [ el botón de discord del pie no sale
  discordInvite: "https://discord.gg/TU_INVITACION",
} as const;

export const STATS = [
  { value: "DATO 1", label: "ETIQUETA 1", accent: true },
  { value: "DATO 2", label: "ETIQUETA 2", accent: false },
  { value: "DATO 3", label: "ETIQUETA 3", accent: false },
  { value: "DATO 4", label: "ETIQUETA 4", accent: false },
] as const;

export interface Tier {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
}

export interface PromoOffer {
  label: string;
  members?: string;
  price: string;
  tiunProductId?: string; // sin id el botón sale desactivado
  deal?: string;
}

export const PRODUCT1_TIERS: Tier[] = [
  {
    name: "PLAN 1",
    price: "PRECIO",
    period: "/ PERIODO",
    features: [
      "CARACTERÍSTICA 1",
      "CARACTERÍSTICA 2",
      "CARACTERÍSTICA 3",
      "CARACTERÍSTICA 4",
      "CARACTERÍSTICA 5",
    ],
  },
  {
    name: "PLAN 2",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3"],
    featured: true,
  },
  {
    name: "PLAN 3",
    price: "PRECIO",
    period: "PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3"],
  },
];

export const PRODUCT2_TIERS: Tier[] = [
  {
    name: "PLAN 1",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
  {
    name: "PLAN 2",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
    featured: true,
  },
  {
    name: "PLAN 3",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
  {
    name: "PLAN 4",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
];

export const PRODUCT3_TIERS: Tier[] = [
  {
    name: "PLAN 1",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
  {
    name: "PLAN 2",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
    featured: true,
  },
  {
    name: "PLAN 3",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
];

export const PRODUCT4_TIERS: Tier[] = [
  {
    name: "PLAN 1",
    price: "PRECIO",
    period: "/ PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
  {
    name: "PLAN 2",
    price: "PRECIO",
    period: "PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
    featured: true,
  },
  {
    name: "PLAN 3",
    price: "PRECIO",
    period: "PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
  {
    name: "PLAN 4",
    price: "PRECIO",
    period: "PERIODO",
    features: ["CARACTERÍSTICA 1", "CARACTERÍSTICA 2", "CARACTERÍSTICA 3", "CARACTERÍSTICA 4"],
  },
];

// ---- página de promociones (se paga en la web con tiun) ----

export const PROMO_COMMUNITIES = [
  {
    name: "COMUNIDAD 1",
    members: "MIEMBROS",
    blurb: "DESCRIPCIÓN DE LA COMUNIDAD",
    flagship: true,
  },
  {
    name: "COMUNIDAD 2",
    members: "MIEMBROS",
    blurb: "DESCRIPCIÓN DE LA COMUNIDAD",
    flagship: false,
  },
] as const;

// los tiunProductId salen del panel de tiun (checkout > products). si se añaden también en
// el worker, el aviso de venta sale con el nombre del producto
export const PROMO_A: PromoOffer[] = [
  { label: "COMUNIDAD 1", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxa1" },
  { label: "COMUNIDAD 2", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxa2" },
  { label: "AMBAS", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxa3", deal: "AHORRO" },
];

export const PROMO_B: PromoOffer[] = [
  { label: "COMUNIDAD 1", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxb1" },
  { label: "COMUNIDAD 2", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxb2" },
  { label: "AMBAS", members: "MIEMBROS", price: "PRECIO", tiunProductId: "p-live-xxxxxb3", deal: "AHORRO" },
];

export const PROMO_C: PromoOffer[] = [
  { label: "DURACIÓN 1", price: "PRECIO", tiunProductId: "p-live-xxxxxc1" },
  { label: "DURACIÓN 2", price: "PRECIO", tiunProductId: "p-live-xxxxxc2", deal: "AHORRO" },
  { label: "DURACIÓN 3", price: "PRECIO", tiunProductId: "p-live-xxxxxc3", deal: "AHORRO" },
];
