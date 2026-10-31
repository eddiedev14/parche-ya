import { useEffect, useState } from "react";

import { auth } from "../firebase/config";

interface Props {
  url?: string | null;
  name: string;
  size?: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

//? Fotos ya descargadas (URL local). Evita pedir la misma foto cada vez que se monta un Avatar
const photoCache = new Map<string, string>();

//? Sin ámbar: el texto blanco no tendría buen contraste
const FALLBACK_COLORS = [
  "#E8481F",
  "#22B07D",
  "#5B3DF5",
  "#D946A8",
  "#2E90FA",
  "#14B8A6",
];

//? El mismo nombre siempre da el mismo color
const getColor = (name: string) => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
};

export const Avatar = ({ url, name, size = 40 }: Props) => {
  const [photo, setPhoto] = useState<string | null>(null);

  //? La foto pasa por nuestro backend, que valida el token y la pide a ImageKit
  useEffect(() => {
    if (!url || !url.startsWith(URL_ENDPOINT)) {
      setPhoto(null);
      return;
    }

    const path = url.slice(URL_ENDPOINT.length);
    const key = `${path}|${size}`;

    const cached = photoCache.get(key);
    if (cached) {
      setPhoto(cached);
      return;
    }

    let cancelled = false;

    const loadPhoto = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch(
          `${API_URL}/api/imagekit-image?path=${encodeURIComponent(path)}&size=${size * 2}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return;

        //? Un <img> no puede mandar el token, por eso se descarga y se usa como URL local
        const blobUrl = URL.createObjectURL(await res.blob());
        photoCache.set(key, blobUrl);
        if (!cancelled) setPhoto(blobUrl);
      } catch {
        //? Si falla, se queda la inicial
      }
    };

    loadPhoto();

    return () => {
      cancelled = true;
    };
  }, [url, size]);

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        onError={() => setPhoto(null)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: getColor(name),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
};
