import { useIonViewDidEnter } from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { OsmTileLayer } from "@/shared/components/map/OsmTileLayer";
import type { CategoryId } from "@/shared/helpers/constants";
import type { Coordinates } from "@/shared/types/plan.types";
import { getPlanPin } from "./plan-pin";

interface Props {
  location: Coordinates;
  category: CategoryId;
}

const MINI_MAP_ZOOM = 16;

//? Sin UI. Ionic monta la página antes de terminar la animación y Leaflet mide mal el contenedor:
//? se recalcula el tamaño cuando la vista ya entró (lo mismo que hace PlansMap)
const ResizeOnViewEnter = () => {
  const map = useMap();
  useIonViewDidEnter(() => {
    map.invalidateSize();
  });
  return null;
};

//? Mapa de solo lectura: sin zoom ni arrastre, solo para ver dónde queda el plan.
//? MapContainer destruye el mapa de Leaflet al desmontarse
export const PlanMiniMap = ({ location, category }: Props) => (
  <div className="rounded-card border-line h-40 overflow-hidden border">
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={MINI_MAP_ZOOM}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      className="isolate h-full w-full"
    >
      <OsmTileLayer />
      <Marker
        position={[location.lat, location.lng]}
        icon={getPlanPin(category, false)}
        interactive={false}
      />
      <ResizeOnViewEnter />
    </MapContainer>
  </div>
);
