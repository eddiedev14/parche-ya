import { useState } from "react";
import { Toast } from "../classes/Toast.class";
import { nomitanimOSMApi } from "../api/nominatim.api";

export interface PlaceResult {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

//? Forma de lo que devuelve Nominatim. lat y lon llegan como texto
interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

//? Recuadro urbano de Cali (borde "Cali ciudad" de OpenStreetMap). Orden: izquierda,arriba,derecha,abajo, en lon,lat
//? Es un rectángulo, no el límite exacto: en los bordes puede colarse algo de Jamundí, Yumbo o Palmira
const CALI_VIEWBOX = "-76.5928,3.5062,-76.4613,3.3322";

export const usePlaceSearch = () => {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    const text = query.trim();
    if (text.length < 3) return;

    setLoading(true);
    const params = new URLSearchParams({
      q: text,
      format: "jsonv2",
      limit: "5",
      countrycodes: "co",
      "accept-language": "es",
      viewbox: CALI_VIEWBOX,
      bounded: "1", // solo resultados dentro del recuadro
    });

    try {
      const res = await nomitanimOSMApi.get(`/search?${params}`);
      const places = res.data as NominatimPlace[];
      setResults(
        places.map((place) => ({
          id: place.place_id,
          name: place.display_name,
          lat: Number(place.lat),
          lng: Number(place.lon),
        })),
      );

      if (places.length === 0) Toast.info("No encontramos ese lugar");
    } catch {
      Toast.error("No pudimos buscar el lugar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setResults([]);

  return { results, loading, search, clear };
};
