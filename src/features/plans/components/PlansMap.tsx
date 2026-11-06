import { useState } from "react";
import { useIonViewDidEnter } from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, useMap, useMapEvents } from "react-leaflet";
import { FlyTo } from "@/shared/components/map/FlyTo";
import { OsmTileLayer } from "@/shared/components/map/OsmTileLayer";
import type { Coordinates, PlanDoc } from "@/shared/types/plan.types";
import { getPlanPin, USER_ICON } from "./plan-pin";

interface Props {
  center: [number, number];
  zoom: number;
  userLocation: Coordinates | null;
  plans: PlanDoc[];
  selectedId: string | null;
  onSelect: (planId: string | null) => void;
}

//? Sin UI. Tocar un espacio vacío del mapa cierra la selección
const DeselectOnMapClick = ({ onDeselect }: { onDeselect: () => void }) => {
  useMapEvents({ click: onDeselect });
  return null;
};

//? Sin UI. Ionic deja la pestaña montada pero oculta, y Leaflet mide 0 px: se recalcula el tamaño al volver a ella
const ResizeOnViewEnter = () => {
  const map = useMap();
  useIonViewDidEnter(() => {
    map.invalidateSize();
  });
  return null;
};

export const PlansMap = ({
  center,
  zoom,
  userLocation,
  plans,
  selectedId,
  onSelect,
}: Props) => {
  //? Objeto nuevo en cada toque: la cámara se centra también al volver a tocar el mismo pin
  const [flyTarget, setFlyTarget] = useState<Coordinates | null>(null);

  const selectPlan = (plan: PlanDoc) => {
    onSelect(plan.id);
    setFlyTarget({ lat: plan.location.lat, lng: plan.location.lng });
  };

  return (
    <MapContainer center={center} zoom={zoom} className="isolate h-full w-full">
      <OsmTileLayer />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={USER_ICON}
          interactive={false}
          zIndexOffset={-1000}
        />
      )}

      {plans.map((plan) => (
        <Marker
          key={plan.id}
          position={[plan.location.lat, plan.location.lng]}
          icon={getPlanPin(plan.category, plan.id === selectedId)}
          zIndexOffset={plan.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => selectPlan(plan) }}
        />
      ))}

      <DeselectOnMapClick onDeselect={() => onSelect(null)} />
      <FlyTo target={flyTarget} />
      <ResizeOnViewEnter />
    </MapContainer>
  );
};
