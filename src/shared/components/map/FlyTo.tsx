import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Coordinates } from "@/shared/types/plan.types";

interface Props {
  target: Coordinates | null;
  //? Si no se pasa, se mantiene el zoom actual del mapa
  zoom?: number;
}

//? Sin UI. Cada vez que llega un `target` nuevo, mueve la cámara del mapa hasta ahí. Tiene que estar dentro de <MapContainer>
export const FlyTo = ({ target, zoom }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], zoom ?? map.getZoom());
  }, [target, zoom, map]);

  return null;
};
