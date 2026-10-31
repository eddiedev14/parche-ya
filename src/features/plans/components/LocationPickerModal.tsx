import { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonProgressBar,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Coordinates } from "@/shared/types/plan.types";
import { DEFAULT_MAP_CENTER } from "@/features/plans/constants";
import { PlaceResult, usePlaceSearch } from "@/shared/hooks/usePlaceSearch";

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

//? Sin UI. Cada vez que llega un `target` nuevo, mueve la cámara del mapa hasta ahí.
const FlyTo = ({ target }: { target: Coordinates | null }) => {
  const map = useMap();

  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 17);
  }, [target, map]);

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
  const [query, setQuery] = useState("");
  //? Solo se llena al elegir un resultado, no al tocar el mapa: si no, la cámara saltaría con cada clic
  const [flyTarget, setFlyTarget] = useState<Coordinates | null>(null);
  const { results, loading, search, clear } = usePlaceSearch();

  const pickResult = (place: PlaceResult) => {
    //? Objeto nuevo en cada elección, así FlyTo se dispara aunque se elija el mismo lugar dos veces
    const coordinates = { lat: place.lat, lng: place.lng };
    setPosition(coordinates); // mueve el pin
    setFlyTarget(coordinates); // mueve la cámara
    setQuery(place.name.split(",")[0]);
    clear();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidPresent={() => {
        setPosition(initial);
        setReady(true);
      }}
      onDidDismiss={() => {
        setReady(false);
        setQuery("");
        setFlyTarget(null);
        clear();
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

        {/* Se busca al presionar Enter (Nominatim permite 1 petición por segundo) */}
        <IonToolbar>
          <IonSearchbar
            value={query}
            placeholder="Busca un lugar"
            enterkeyhint="search"
            onIonInput={(event) => setQuery(event.detail.value ?? "")}
            onKeyDown={(event) => event.key === "Enter" && search(query)}
            onIonClear={clear}
          />
          {loading && <IonProgressBar type="indeterminate" />}
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
            <FlyTo target={flyTarget} />
          </MapContainer>
        )}

        {/* Resultados flotando sobre el mapa. El mapa lleva `isolate`, así que z-10 queda por encima */}
        {results.length > 0 && (
          <IonList
            lines="full"
            className="rounded-card absolute inset-x-2 top-2 z-10 shadow-lg"
          >
            {results.map((place) => (
              <IonItem
                key={place.id}
                button
                detail={false}
                onClick={() => pickResult(place)}
              >
                <IonLabel className="ion-text-wrap text-body">
                  {place.name}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar className="px-4 pt-2 pb-[max(24px,var(--ion-safe-area-bottom))]">
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
