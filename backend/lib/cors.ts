import type { VercelRequest, VercelResponse } from "@vercel/node";

//? Origen del WebView de Capacitor en Android (androidScheme por defecto = https). Es el único que necesita el APK de producción
const PRODUCTION_ORIGINS = ["https://localhost"];

//? Solo para desarrollo: ionic serve y Capacitor con androidScheme "http". En producción no se aceptan
const DEVELOPMENT_ORIGINS = ["http://localhost:8100", "http://localhost"];

//? Se amplían con ALLOWED_ORIGINS (separados por coma)
const EXTRA_ORIGINS =
  process.env.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const ALLOWED_ORIGINS = [
  ...PRODUCTION_ORIGINS,
  ...(process.env.VERCEL_ENV === "production" ? [] : DEVELOPMENT_ORIGINS),
  ...EXTRA_ORIGINS,
];

export const setCorsHeaders = (
  req: VercelRequest,
  res: VercelResponse,
  methods: "GET" | "POST",
) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  //? Vary siempre: la respuesta cambia según el origen, y las cachés no deben mezclarlas
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", `${methods}, OPTIONS`);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
};
