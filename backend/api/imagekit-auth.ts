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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
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

    // 3. Generar parametros de ImageKit
    const authenticationParameters = imagekit.getAuthenticationParameters();

    // 4. Respuesta al frontend
    return res.status(200).json({
      ...authenticationParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized or invalid token",
    });
  }
}
