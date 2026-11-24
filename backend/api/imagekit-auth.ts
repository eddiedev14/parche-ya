import type { VercelRequest, VercelResponse } from "@vercel/node";
import ImageKit from "imagekit";
import { setCorsHeaders } from "../lib/cors.js";
import { auth } from "../lib/firebaseAdmin.js";

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

//? La firma solo sirve para una subida inmediata (por defecto ImageKit la deja vivir 30 min)
const SIGNATURE_TTL_SECONDS = 5 * 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, "GET");

  //? Preflight: el header Authorization hace que el navegador lo envíe antes del GET
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  // 1. Obtener token del usuario
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  // 2. Verificar token con Firebase
  //? Solo este paso devuelve 401: si algo más falla, no es culpa de la sesión del usuario
  try {
    await auth.verifyIdToken(idToken);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // 3. Generar parametros de ImageKit
    const authenticationParameters = imagekit.getAuthenticationParameters(
      undefined,
      Math.floor(Date.now() / 1000) + SIGNATURE_TTL_SECONDS,
    );

    // 4. Respuesta al frontend
    return res.status(200).json({
      ...authenticationParameters,
      publicKey: IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
