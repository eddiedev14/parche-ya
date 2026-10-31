import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Coordinates } from "@/shared/types/plan.types";
import { DEFAULT_MAP_CENTER } from "@/features/plans/constants";

//? Ícono propio del pin. Con Vite, el ícono por defecto de Leaflet antepone una ruta detectada del CSS
//? a la URL de la imagen y la rompe, por eso se reemplaza completo
const PIN_ICON = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coordinates: Coordinates) => void;
  initial: Coordinates | null;
}

//? Componente sin UI: solo escucha los clics del mapa. Tiene que estar dentro de <MapContainer>
const ClickToPick = ({ onPick }: { onPick: (c: Coordinates) => void }) => {
  useMapEvents({
    click: ({ latlng }) => onPick({ lat: latlng.lat, lng: latlng.lng }),
  });
  return null;
};

export const LocationPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  initial,
}: Props) => {
  const [ready, setReady] = useState(false);
  const [position, setPosition] = useState<Coordinates | null>(null);

  return (
    <IonModal
      isOpen={isOpen}
      onDidPresent={() => {
        setPosition(initial);
        setReady(true);
      }}
      onDidDismiss={() => {
        setReady(false);
        onClose();
      }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton aria-label="Cerrar" onClick={onClose}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Elige el lugar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false}>
        {ready && (
          <MapContainer
            center={initial ? [initial.lat, initial.lng] : DEFAULT_MAP_CENTER}
            zoom={16}
            className="isolate h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && (
              <Marker position={[position.lat, position.lng]} icon={PIN_ICON} />
            )}
            <ClickToPick onPick={setPosition} />
          </MapContainer>
        )}
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar className="px-4 pt-2 pb-[max(24px,env(safe-area-inset-bottom))]">
          <IonButton
            expand="block"
            className="m-0"
            disabled={!position}
            onClick={() => position && onConfirm(position)}
          >
            Usar esta ubicación
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};
