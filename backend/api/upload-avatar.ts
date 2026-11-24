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

//? La app toma la foto a 640 px y calidad 80 (unos 100-300 KB). 2 MB deja margen y frena archivos enormes
const MAX_BYTES = 2 * 1024 * 1024;

//? Todo JPEG empieza con estos 3 bytes. El Content-Type lo escribe el cliente, así que no se confía en él
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

//? Lee el cuerpo (la imagen cruda) y corta en cuanto supera el límite, sin cargar el resto en memoria
//? No se usa req.body: Vercel lo interpretaría con su propio límite (1 MB) según el Content-Type
const readBody = async (req: VercelRequest): Promise<Buffer | null> => {
  const chunks: Uint8Array[] = [];
  let total = 0;

  for await (const chunk of req as AsyncIterable<Uint8Array>) {
    total += chunk.length;
    if (total > MAX_BYTES) return null;
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, "POST");

  //? Preflight: Authorization y Content-Type hacen que el navegador lo envíe antes del POST
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 1. Obtener token del usuario
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  // 2. Verificar token con Firebase
  //? Solo este paso devuelve 401: si ImageKit falla, la sesión del usuario sigue siendo válida
  let uid: string;
  try {
    ({ uid } = await auth.verifyIdToken(idToken));
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // 3. Leer y validar la imagen
  //? Si el cliente avisa de un tamaño excesivo se rechaza sin leer nada
  if (Number(req.headers["content-length"]) > MAX_BYTES) {
    return res.status(413).json({ message: "Image too large" });
  }

  try {
    const image = await readBody(req);

    if (!image) {
      return res.status(413).json({ message: "Image too large" });
    }

    if (!JPEG_SIGNATURE.every((byte, i) => image[i] === byte)) {
      return res.status(400).json({ message: "Invalid image" });
    }

    // 4. Subir a ImageKit
    //? Nombre y carpeta los fija el servidor: cada usuario solo puede escribir su propia foto
    const result = await imagekit.upload({
      file: image,
      fileName: `${uid}.jpg`,
      folder: "/avatars",
      useUniqueFileName: false,
      overwriteFile: true,
    });

    // 5. Respuesta al frontend
    return res.status(200).json({ url: result.url });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
