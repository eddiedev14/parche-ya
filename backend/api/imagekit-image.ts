import type { VercelRequest, VercelResponse } from "@vercel/node";
import { auth } from "./firebaseAdmin.js";
import ImageKit from "imagekit";

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error("Missing ImageKit environment variables");
}

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

//? Orígenes que pueden llamar a este endpoint desde el navegador. Se amplían con ALLOWED_ORIGINS (separados por coma)
const ALLOWED_ORIGINS = [
  "http://localhost:8100", // ionic serve
  "https://localhost", // Capacitor Android (androidScheme por defecto desde Capacitor 6)
  "http://localhost", // Capacitor Android con androidScheme: "http"
  "capacitor://localhost", // Capacitor iOS
  "ionic://localhost",
  ...(process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? []),
];

const setCorsHeaders = (req: VercelRequest, res: VercelResponse) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
};

//? Solo se sirven fotos de perfil (/avatars/archivo.jpg), no cualquier archivo del bucket
const PATH_REGEX = /^\/avatars\/[\w.-]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  //? Preflight: el header Authorization hace que el navegador lo envíe antes del GET
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. Obtener token del usuario
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // 2. Verificar token con Firebase
    const decodedUser = await auth.verifyIdToken(idToken);

    if (!decodedUser?.uid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 3. Validar parámetros (size entre 32 y 256 px)
    const path = String(req.query.path ?? "");
    const size = Math.min(Math.max(Number(req.query.size) || 80, 32), 256);

    if (!PATH_REGEX.test(path)) {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }

    // 4. Firmar la URL con la private key (solo la ve el servidor)
    const signedUrl = imagekit.url({
      path,
      transformation: [
        {
          width: String(size),
          height: String(size),
          crop: "maintain_ratio",
          quality: "80",
          format: "webp",
        },
      ],
      signed: true,
      expireSeconds: 60,
    });

    // 5. Traer la imagen de ImageKit y devolverla al frontend
    const imageResponse = await fetch(signedUrl);

    if (!imageResponse.ok) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.setHeader(
      "Content-Type",
      imageResponse.headers.get("content-type") ?? "image/webp",
    );
    //? "private": solo el navegador del usuario la guarda
    res.setHeader("Cache-Control", "private, max-age=86400");

    return res.status(200).send(Buffer.from(await imageResponse.arrayBuffer()));
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized or invalid token",
    });
  }
}
